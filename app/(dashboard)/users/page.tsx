"use client";
import { Button }      from "@/components/atoms/Button";
import { Spinner }     from "@/components/atoms/Spinner";
import { PageHeader }  from "@/components/molecules/PageHeader";
import Modal           from "@/components/organisms/Modal";
import { UserFilters } from "@/features/users/components/UserFilters";
import { UserForm }    from "@/features/users/components/UserForm";
import { UserTable }   from "@/features/users/components/UserTable";
import { useUsers }    from "@/features/users/hooks/useUsers";
import { FiPlus, FiShield } from "react-icons/fi";

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <FiShield size={24} className="text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Akses Ditolak</h2>
      <p className="text-sm text-gray-400">Halaman ini hanya dapat diakses oleh Admin.</p>
    </div>
  );
}

export default function UsersPage() {
  const usr = useUsers();

  // Tampilkan loading saat pertama kali auth check
  if (usr.isAdmin === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  if (!usr.isAdmin) return <AccessDenied />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manajemen User"
        description="Kelola akun pengguna dan hak akses"
        actions={
          <Button size="sm" leftIcon={<FiPlus size={14} />} onClick={usr.openAdd}>
            Tambah User
          </Button>
        }
      />

      <div className="card">
        <UserFilters
          search={usr.search} roleFilter={usr.roleFilter}
          onSearchChange={usr.handleSearchChange}
          onRoleChange={usr.handleRoleChange}
        />
        <UserTable
          data={usr.data} loading={usr.loading}
          meta={usr.meta} currentUserId={usr.currentUserId}
          onEdit={usr.openEdit} onDelete={usr.handleDelete}
          onPageChange={usr.setPage}
        />
      </div>

      <Modal
        open={usr.modal} onClose={usr.closeModal}
        title={usr.editing ? "Edit User" : "Tambah User Baru"}
        footer={
          <>
            <Button variant="secondary" onClick={usr.closeModal}>Batal</Button>
            <Button form="user-form" type="submit" loading={usr.saving}>Simpan</Button>
          </>
        }
      >
        <UserForm
          formId="user-form"
          form={usr.form}
          isEdit={!!usr.editing}
          onUpdate={usr.updateForm}
          onSubmit={usr.handleSubmit}
        />
      </Modal>
    </div>
  );
}