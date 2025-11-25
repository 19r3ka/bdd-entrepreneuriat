import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

export const useConfirmation = () => {
	const confirm = useConfirm();
	const toast = useToast();

	/**
	 * Generic confirmation dialog
	 */
	const showConfirmation = (
		message: string,
		header: string,
		acceptCallback: () => void,
		rejectCallback?: () => void,
	) => {
		confirm.require({
			message,
			header,
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				acceptCallback();
			},
			reject: () => {
				if (rejectCallback) {
					rejectCallback();
				}
			},
		});
	};

	/**
	 * Specialized delete confirmation for a single entity.
	 */
	const confirmDelete = (entityName: string, acceptCallback: () => Promise<void> | void) => {
		showConfirmation(
			`Are you sure you want to delete this ${entityName}?`,
			`Delete ${entityName}`,
			async () => {
				await acceptCallback();
				toast.add({
					severity: 'success',
					summary: `${entityName} deleted`,
					life: 3000,
				});
			},
		);
	};

	/**
	 * Specialized delete confirmation for multiple entities.
	 */
	const confirmDeleteSelected = (
		entityName: string,
		count: number,
		acceptCallback: () => Promise<void> | void,
	) => {
		showConfirmation(
			`Are you sure you want to delete ${count} ${entityName}(s)?`,
			`Delete ${entityName}(s)`,
			async () => {
				await acceptCallback();
				toast.add({
					severity: 'success',
					summary: `${count} ${entityName}(s) deleted`,
					life: 3000,
				});
			},
		);
	};

	return {
		showConfirmation,
		confirmDelete,
		confirmDeleteSelected,
	};
};
