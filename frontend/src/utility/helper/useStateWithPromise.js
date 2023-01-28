import { useCallback, useEffect, useRef, useState } from 'react';

const useStateWithPromise = (initialState) => {
	const [state, setState] = useState(initialState);
	const resolverRef = useRef(null);

	useEffect(() => {
		if (resolverRef.current) {
			resolverRef.current(state);
			resolverRef.current = null;
		}
		/**
		 * Vì một trạng thái cập nhật có thể được kích hoạt lại chính xác cùng với một trạng thái
		 * nên nó không đủ để chỉ định state là một phụ thuộc duy nhất của useEffect
		 * đó là lý do tại sao resolverRef.current cũng là một phụ thuộc, bởi vì nó đảm bảo
		 * hàm handleSetState đã được gọi trong lần render trước
		 */
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolverRef.current, state]);

	const handleSetState = useCallback(
		(stateAction) => {
			setState(stateAction);
			return new Promise((resolve) => {
				resolverRef.current = resolve;
			});
		},
		[setState],
	);

	return [state, handleSetState];
};

export default useStateWithPromise;
