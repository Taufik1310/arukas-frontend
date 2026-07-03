"use client";
import { Button }          from "@/components/atoms/Button";
import { PageHeader }      from "@/components/molecules/PageHeader";
import Modal               from "@/components/organisms/Modal";
import { SupplierFilters } from "@/features/suppliers/components/SupplierFilters";
import { SupplierForm }    from "@/features/suppliers/components/SupplierForm";
import { SupplierTable }   from "@/features/suppliers/components/SupplierTable";
import { useSuppliers }    from "@/features/suppliers/hooks/useSuppliers";
import { FiPlus }          from "react-icons/fi";

export default function SuppliersPage() {
  const sup = useSuppliers();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Supplier"
        description="Kelola data pemasok produk"
        actions={
          <Button size="sm" leftIcon={<FiPlus size={14} />} onClick={sup.openAdd}>
            Tambah Supplier
          </Button>
        }
      />

      <div className="card">
        <SupplierFilters search={sup.search} onSearchChange={sup.handleSearchChange} />
        <SupplierTable
          data={sup.data} loading={sup.loading} meta={sup.meta}
          onEdit={sup.openEdit} onDelete={sup.handleDelete} onPageChange={sup.setPage}
        />
      </div>

      <Modal
        open={sup.modal} onClose={sup.closeModal}
        title={sup.editing ? "Edit Supplier" : "Tambah Supplier"} size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={sup.closeModal}>Batal</Button>
            <Button form="sup-form" type="submit" loading={sup.saving}>Simpan</Button>
          </>
        }
      >
        <SupplierForm
          formId="sup-form" form={sup.form}
          onUpdate={sup.updateForm} onSubmit={sup.handleSubmit}
        />
      </Modal>
    </div>
  );
}