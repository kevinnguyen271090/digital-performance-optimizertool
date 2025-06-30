# DATABASE OVERVIEW

> **Hướng dẫn:**
> - Dưới đây là tổng hợp cấu trúc database thực tế (bảng, cột, constraint, function, trigger, policy) của hệ thống.
> - Chỉ liệt kê các bảng, function, trigger, policy thuộc schema `public` liên quan business logic.

---

## 1. Tables & Columns

### organizations
| column_name | data_type                   | is_nullable | column_default            |
| ----------- | --------------------------- | ----------- | ------------------------- |
| id          | uuid                        | NO          | gen_random_uuid()         |
| name        | character varying           | NO          | null                      |
| domain      | character varying           | YES         | null                      |
| plan        | character varying           | YES         | 'free'::character varying |
| settings    | jsonb                       | YES         | null                      |
| created_at  | timestamp without time zone | YES         | now()                     |
| updated_at  | timestamp without time zone | YES         | now()                     |

### organization_members
| column_name     | data_type                   | is_nullable | column_default              |
| ---------------| --------------------------- | ----------- | --------------------------- |
| id             | uuid                        | NO          | gen_random_uuid()           |
| organization_id| uuid                        | NO          | null                        |
| user_id        | uuid                        | NO          | null                        |
| role           | character varying           | YES         | 'member'::character varying |
| permissions    | jsonb                       | YES         | null                        |
| created_at     | timestamp without time zone | YES         | now()                       |

### user_profiles
| column_name | data_type                | is_nullable | column_default |
| ----------- | ----------------------- | ----------- | -------------- |
| user_id     | uuid                    | NO          | null           |
| username    | text                    | YES         | null           |
| email       | text                    | YES         | null           |
| full_name   | text                    | YES         | null           |
| avatar_url  | text                    | YES         | null           |
| role        | text                    | YES         | 'user'::text   |
| created_at  | timestamp with time zone| YES         | now()          |

### ... (bổ sung các bảng khác nếu cần)

---

## 2. Constraints & Relationships
| table_name           | constraint_name                                  | type         | column_name         | foreign_table_name   | foreign_column_name |
| -------------------- | ------------------------------------------------ | ------------ | ------------------- | -------------------- | ------------------- |
| organizations        | organizations_pkey                               | PRIMARY KEY  | id                  | organizations        | id                  |
| organization_members | organization_members_pkey                        | PRIMARY KEY  | id                  | organization_members | id                  |
| organization_members | organization_members_organization_id_fkey        | FOREIGN KEY  | organization_id     | organizations        | id                  |
| organization_members | organization_members_user_id_fkey                | FOREIGN KEY  | user_id             |                      |                     |
| organization_members | organization_members_organization_id_user_id_key | UNIQUE       | organization_id     | organization_members | user_id             |
| organization_members | organization_members_organization_id_user_id_key | UNIQUE       | user_id             | organization_members | organization_id     |
| user_profiles        | user_profiles_pkey                               | PRIMARY KEY  | user_id             | user_profiles        | user_id             |
| user_profiles        | user_profiles_user_id_fkey                       | FOREIGN KEY  | user_id             |                      |                     |
| user_profiles        | user_profiles_user_id_key                        | UNIQUE       | user_id             | user_profiles        | user_id             |

---

## 3. Functions
| function_name              | definition (rút gọn) |
| --------------------------| --------------------- |
| handle_new_user            | **Mới:** Tạo organization, lấy id organization vừa tạo, rồi add user vào organization_members với role owner. Sử dụng RETURNING id INTO new_org_id để lấy id. |
| update_goal_updated_at     | Cập nhật updated_at khi update goals. |
| cleanup_old_notifications  | Xóa notification đã đọc >30 ngày. |
| cleanup_old_activity_logs  | Xóa activity_logs >90 ngày. |
| cleanup_old_imported_data  | Xóa imported_data >1 năm. |
| get_table_sizes            | Trả về kích thước các bảng. |
| get_index_usage            | Trả về usage của index. |
| cleanup_all_old_data       | Dọn dẹp nhiều bảng cũ. |
| cleanup_old_analytics_data | Xóa analytics_data >1 năm, audit_logs >6 tháng, error_logs >3 tháng. |

---

## 4. Triggers
| table      | trigger_name               | timing  | event  | function                  |
| ---------- | --------------------------| ------- | ------ | ------------------------- |
| goals      | trg_update_goal_updated_at | BEFORE  | UPDATE | update_goal_updated_at()  |

---

## 5. Policies (RLS)
| table_name           | policy_name                                         | command | using_expression (rút gọn) |
| -------------------- | ---------------------------------------------------| ------- | -------------------------- |
| organizations        | Members can view their organizations                | r       | id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid()) |
| organizations        | Org members can view their organizations           | r       | id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid()) |
| organizations        | Org owner/admin can update organization             | w       | id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner','admin')) |
| organizations        | Users can create organizations                      | a       | true |
| organization_members | User can view their memberships                     | r       | user_id = auth.uid() |
| organization_members | Users can insert themselves to organization         | a       | user_id = auth.uid() |
| organization_members | Org owner/admin can insert/update/delete members    | a/w/d   | organization_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner','admin')) |
| user_profiles        | User can access own profile                         | r       | auth.uid() = user_id |
| user_profiles        | User can update own profile                         | w       | auth.uid() = user_id |
| user_profiles        | Disallow delete                                     | d       | false |
| ... (bổ sung các policy khác nếu cần) |

---

## 6. Notes & Special Logic
- Khi tạo user mới, function handle_new_user sẽ tự động tạo organization, lấy id organization vừa tạo, rồi add user vào organization_members với role owner (dùng RETURNING id INTO new_org_id).
- Các bảng dữ liệu đều có RLS bảo vệ, chỉ user hoặc thành viên organization mới xem/sửa/xóa dữ liệu liên quan.
- Các function cleanup_* dùng để dọn dẹp dữ liệu cũ định kỳ.
- **Đã bổ sung ON DELETE CASCADE cho các foreign key liên kết user_id ở user_profiles và organization_members, giúp xóa user trên Auth sẽ tự động xóa dữ liệu liên quan.**
- **Đã kiểm thử thành công luồng đăng ký, xác thực email, đăng nhập, xóa user và dữ liệu liên quan.**
- **Trang Profile đã được refactor để hiển thị và cập nhật thông tin user (user_profiles), trạng thái xác thực email, danh sách tổ chức, và các tính năng quản lý cá nhân phù hợp với hệ thống multi-organization.**

---

> **Cập nhật file này mỗi khi có thay đổi database để team dễ tra cứu và bảo trì!** 