"use client";
import { Button }            from "@/components/atoms/Button";
import { PageHeader }        from "@/components/molecules/PageHeader";
import Modal                 from "@/components/organisms/Modal";
import { CategoryFilters }   from "@/features/categories/components/CategoryFilters";
import { CategoryForm }      from "@/features/categories/components/CategoryForm";
import { CategoryTable }     from "@/features/categories/components/CategoryTable";
import { useCategories }     from "@/features/categories/hooks/useCategories";
import { FiPlus }            from "react-icons/fi";

export default function CategoriesPage() {
  const cats = useCategories();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Kategori Produk"
        description="Kelola kategori produk toko"
        actions={
          <Button size="sm" leftIcon={<FiPlus size={14} />} onClick={cats.openAdd}>
            Tambah Kategori
          </Button>
        }
      />

      <div className="card">
        <CategoryFilters search={cats.search} onSearchChange={cats.handleSearchChange} />
        <CategoryTable
          data={cats.data} loading={cats.loading} meta={cats.meta}
          onEdit={cats.openEdit} onDelete={cats.handleDelete} onPageChange={cats.setPage}
        />
      </div>

      <Modal
        open={cats.modal} onClose={cats.closeModal}
        title={cats.editing ? "Edit Kategori" : "Tambah Kategori"}
        footer={
          <>
            <Button variant="secondary" onClick={cats.closeModal}>Batal</Button>
            <Button form="cat-form" type="submit" loading={cats.saving}>Simpan</Button>
          </>
        }
      >
        <CategoryForm
          formId="cat-form" form={cats.form}
          onUpdate={cats.updateForm} onSubmit={cats.handleSubmit}
        />
      </Modal>
    </div>
  );
}