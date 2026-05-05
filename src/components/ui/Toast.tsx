import { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
	message: string;
	type?: ToastType;
	onClose?: () => void;
	duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
	useEffect(() => {
		if (!message || !onClose) return;

		const timer = window.setTimeout(() => {
			onClose();
		}, duration);

		return () => window.clearTimeout(timer);
	}, [message, onClose, duration]);

	if (!message) return null;

	const styles = {
		success: 'border-green-200 bg-green-50 text-green-700',
		error: 'border-red-200 bg-red-50 text-red-700',
		info: 'border-blue-200 bg-blue-50 text-blue-700',
	};

	const icons = {
		success: <CheckCircle className='h-5 w-5' />,
		error: <AlertTriangle className='h-5 w-5' />,
		info: <Info className='h-5 w-5' />,
	};

	return (
		<div
			role='status'
			aria-live='polite'
			className={`fixed right-5 top-5 z-50 max-w-sm rounded-2xl border px-5 py-4 text-sm font-semibold shadow-lg animate-[slideIn_0.25s_ease-out] ${styles[type]}`}>
			<div className='flex items-start gap-3'>
				<div className='mt-0.5'>{icons[type]}</div>

				<p className='flex-1'>{message}</p>

				{onClose && (
					<button
						type='button'
						onClick={onClose}
						aria-label='Close notification'
						className='rounded-full p-0.5 opacity-60 transition hover:bg-black/5 hover:opacity-100'>
						<X className='h-4 w-4' />
					</button>
				)}
			</div>
		</div>
	);
}
