"use client";
import { Button }          from "@/components/atoms/Button";
import { PageHeader }      from "@/components/molecules/PageHeader";
import Modal               from "@/components/organisms/Modal";
import { POFormContent }   from "@/features/purchases/components/POFormContent";
import { PurchaseFilters } from "@/features/purchases/components/PurchaseFilters";
import { PurchaseTable }   from "@/features/purchases/components/PurchaseTable";
import { usePurchases }    from "@/features/purchases/hooks/usePurchases";
import { FiPlus }          from "react-icons/fi";

export default function PurchasesPage() {
  const po = usePurchases();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transaksi Pembelian"
        description="Kelola purchase order dan penerimaan barang"
        actions={
          <Button size="sm" leftIcon={<FiPlus size={14} />} onClick={po.openModal}>
            Buat Purchase Order
          </Button>
        }
      />

      <div className="card">
        <PurchaseFilters
          search={po.search} statusFilter={po.statusFilter}
          onSearchChange={po.handleSearchChange}
          onStatusChange={po.handleStatusFilterChange}
        />
        <PurchaseTable
          data={po.data} loading={po.loading} receiving={po.receiving}
          meta={po.meta} onReceive={po.handleReceive} onPageChange={po.setPage}
        />
      </div>

      <Modal
        open={po.modal} onClose={po.closeModal}
        title="Buat Purchase Order" size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={po.closeModal}>Batal</Button>
            <Button form="po-form" type="submit" loading={po.saving}>Buat PO</Button>
          </>
        }
      >
        <POFormContent
          formId="po-form"
          form={po.form} total={po.total}
          suppliers={po.suppliers}
          productSearch={po.productSearch}
          searchResults={po.searchResults}
          onFormFieldUpdate={po.updateFormField}
          onProductSearchChange={po.setPSearch}
          onAddItem={po.addItem}
          onUpdateItem={po.updateItem}
          onRemoveItem={po.removeItem}
          onSubmit={po.handleSubmit}
        />
      </Modal>
    </div>
  );
}