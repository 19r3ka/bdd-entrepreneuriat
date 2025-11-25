// Global error handler service
export class ErrorHandler {
	// Handle API errors - this method should be called from components where toast service is available
	handleApiError(error: unknown, toast?: any, customMessage?: string): void {
		let message = "An unexpected error occurred";

		if (error instanceof Error) {
			message = error.message;
		} else if (typeof error === "string") {
			message = error;
		}

		if (customMessage) {
			message = customMessage;
		}

		if (toast) {
			toast.add({
				severity: "error",
				summary: "Error",
				detail: message,
				life: 5000,
			});
		} else {
			console.error("Toast service not provided, showing in console:", message);
		}

		console.error("API Error:", error);
	}

	// Handle validation errors from Zod schema
	handleValidationError(
		errors: any,
		toast?: any,
		customMessage?: string,
	): void {
		const message = customMessage || "Validation failed";

		if (toast) {
			toast.add({
				severity: "error",
				summary: "Validation Error",
				detail: message,
				life: 5000,
			});
		} else {
			console.error("Toast service not provided, showing in console:", message);
		}

		// Log the validation errors for debugging
		if (Array.isArray(errors)) {
			errors.forEach((error) => {
				console.error("Validation Error:", error);
			});
		}
	}

	// Handle generic errors
	handleGenericError(
		error: unknown,
		toast?: any,
		customMessage?: string,
	): void {
		let message = "An unexpected error occurred";

		if (error instanceof Error) {
			message = error.message;
		} else if (typeof error === "string") {
			message = error;
		}

		if (customMessage) {
			message = customMessage;
		}

		if (toast) {
			toast.add({
				severity: "error",
				summary: "Error",
				detail: message,
				life: 5000,
			});
		} else {
			console.error("Toast service not provided, showing in console:", message);
		}

		console.error("Generic Error:", error);
	}
}

// Create a singleton instance
export const errorHandler = new ErrorHandler();
