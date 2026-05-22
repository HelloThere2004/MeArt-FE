<template>
  <div class="admin-members">
    <h3 class="mb-4">Danh sách Giáo viên / Nhân viên</h3>

    <!-- Add member form -->
    <div class="card mb-4 p-3 bg-light border-0 shadow-sm add-form">
      <h5>+ Thêm thành viên mới</h5>
      <div class="form-fields mt-2">
        <input
          v-model="newMember.name"
          type="text"
          class="form-control"
          placeholder="Tên..."
          required
        />
        <input
          v-model="newMember.role"
          type="text"
          class="form-control"
          placeholder="Vai trò..."
          required
        />
        <input
          v-model="newMember.description"
          type="text"
          class="form-control"
          placeholder="Mô tả..."
          required
        />
        <input
          type="file"
          @change="onFileSelected"
          ref="fileInput"
          class="form-control"
          accept="image/*"
          required
        />
        <button @click="addMember" class="btn btn-primary btn-add" :disabled="isUploading">
          {{ isUploading ? 'Đang up...' : 'Thêm' }}
        </button>
      </div>
    </div>

    <!-- Desktop: Table view (hidden on mobile) -->
    <div class="table-view d-none d-md-block">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Thành viên</th>
              <th>Vai trò</th>
              <th>Mô tả</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>{{ member.id }}</td>
              <td class="fw-bold">
                <img
                  v-if="member.image_url"
                  :src="member.image_url"
                  alt="avatar"
                  class="member-avatar"
                />
                {{ member.name }}
              </td>
              <td>
                <span class="badge bg-secondary">{{ member.role }}</span>
              </td>
              <td>{{ member.description }}</td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteMember(member.id, member.image_url)"
                >
                  Xóa
                </button>
              </td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="5" class="text-center text-muted py-3">Chưa có thành viên nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile: Card view (hidden on desktop) -->
    <div class="card-view d-md-none">
      <div v-if="members.length === 0" class="text-center text-muted py-4">
        Chưa có thành viên nào
      </div>
      <div
        v-for="member in members"
        :key="'card-' + member.id"
        class="card mb-3 shadow-sm member-mobile-card"
      >
        <div class="card-body">
          <div class="d-flex align-items-start gap-3">
            <img
              v-if="member.image_url"
              :src="member.image_url"
              alt="avatar"
              class="member-avatar-mobile"
            />
            <div class="flex-grow-1 min-w-0">
              <h6 class="fw-bold mb-1">{{ member.name }}</h6>
              <span class="badge bg-secondary mb-2">{{ member.role }}</span>
              <p class="text-muted small mb-2">{{ member.description }}</p>
            </div>
          </div>
          <button
            class="btn btn-sm btn-outline-danger w-100 mt-2"
            @click="deleteMember(member.id, member.image_url)"
          >
            Xóa thành viên
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'AdminMembers',
  data() {
    return {
      members: [],
      newMember: { name: '', role: '', description: '', image_url: '' },
      selectedImage: null,
      isUploading: false,
    }
  },
  async mounted() {
    await this.fetchMembers()
  },
  methods: {
    async fetchMembers() {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: false })
      if (error) {
        console.error('Lỗi khi kéo data:', error.message)
        return
      }
      this.members = data || []
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0]
    },
    async addMember() {
      if (
        !this.newMember.name ||
        !this.newMember.role ||
        !this.newMember.description ||
        !this.selectedImage
      ) {
        alert('Vui lòng điền đủ thông tin và chọn ảnh!')
        return
      }

      this.isUploading = true
      try {
        const fileExt = this.selectedImage.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        // Upload ảnh lên bucket 'members'
        const { uploadError } = await supabase.storage
          .from('members')
          .upload(fileName, this.selectedImage)
        if (uploadError) throw uploadError

        // Lấy link public
        const { data: publicUrlData } = supabase.storage.from('members').getPublicUrl(fileName)

        // Insert vào DB
        const { data: dbData, error: dbError } = await supabase
          .from('members')
          .insert([
            {
              name: this.newMember.name,
              role: this.newMember.role,
              description: this.newMember.description,
              image_url: publicUrlData.publicUrl,
            },
          ])
          .select()

        if (dbError) throw dbError

        this.members.unshift(dbData[0])

        // Reset form
        this.newMember = { name: '', role: '', description: '', image_url: '' }
        this.selectedImage = null
        this.$refs.fileInput.value = ''
      } catch (error) {
        console.error('Lỗi:', error.message)
        alert('Thao tác thất bại!')
      } finally {
        this.isUploading = false
      }
    },
    async deleteMember(id, imageUrl) {
      if (!confirm('Sếp có chắc chắn muốn xóa thành viên này?')) return

      try {
        // 1. Xóa trong DB
        const { error: dbError } = await supabase.from('members').delete().eq('id', id)
        if (dbError) throw dbError

        // 2. Xóa file trên Storage (Trích xuất tên file từ URL)
        if (imageUrl) {
          const fileName = imageUrl.split('/').pop()
          await supabase.storage.from('members').remove([fileName])
        }

        // 3. Cập nhật UI
        this.members = this.members.filter((m) => m.id !== id)
      } catch (error) {
        console.error('Lỗi xóa:', error.message)
        alert('Xóa thất bại!')
      }
    },
  },
}
</script>

<style scoped>
.admin-members {
  max-width: 100%;
}

/* Desktop: member avatar in table */
.member-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}

/* Add form fields - desktop row, mobile column */
.form-fields {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-fields .form-control {
  flex: 1 1 150px;
  min-width: 120px;
}

.btn-add {
  flex: 0 0 auto;
  white-space: nowrap;
}

/* Mobile card view */
.member-mobile-card {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}

.member-avatar-mobile {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
  flex-shrink: 0;
}

.min-w-0 {
  min-width: 0;
}

/* ============ RESPONSIVE ============ */

/* Tablet & below: stack form fields */
@media (max-width: 991px) {
  .form-fields {
    flex-direction: column;
  }

  .form-fields .form-control {
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
    font-size: 15px;
    padding: 10px 12px;
  }

  .btn-add {
    width: 100%;
    padding: 10px;
    font-size: 15px;
  }

  .add-form {
    padding: 1rem !important;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .admin-members h3 {
    font-size: 18px;
    margin-bottom: 12px !important;
  }

  .add-form h5 {
    font-size: 15px;
  }

  .form-fields .form-control {
    font-size: 14px;
    padding: 8px 10px;
  }

  .btn-add {
    font-size: 14px;
    padding: 8px;
  }

  .member-avatar-mobile {
    width: 48px;
    height: 48px;
  }

  .member-mobile-card .card-body {
    padding: 12px;
  }

  .member-mobile-card h6 {
    font-size: 15px;
  }
}
</style>
