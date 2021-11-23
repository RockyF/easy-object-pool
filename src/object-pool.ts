/**
 * Created by rockyl on 16/3/9.
 *
 * ObjectPool
 */

const RECYCLE_FIELD = '__recycling'

const clears = []

export function clearAll() {
	for (let clear of clears) {
		clear()
	}
}

export function useObjectPool<T>(factoryMethod: (...params) => T, options: {
	                                 initializationMethod?: (instance: T, ...params) => void,
	                                 recycleMethod?: (instance: T) => void,
	                                 disposeMethod?: (instance: T, ...params) => void,
	                                 preInstantiationQuantity?: number,
	                                 limit?: number,
                                 } = {}
): [(...params) => T, (instance: T | T[]) => void, () => void] {
	const {
		initializationMethod,
		recycleMethod,
		disposeMethod,
		preInstantiationQuantity = 0,
		limit = 0,
	} = options

	if (!factoryMethod) {
		console.warn('Please provide factory method')
		return
	}

	const pool: T[] = []

	if (preInstantiationQuantity > 0) {
		for (let i = 0; i < preInstantiationQuantity; i++) {
			pool.push(factoryMethod.apply(null))
		}
	}

	function _recycle(instance: T) {
		if (instance[RECYCLE_FIELD]) {
			console.warn('The instance has been recycled')
			return
		}

		recycleMethod && recycleMethod(instance)

		if (limit > 0 && pool.length >= limit) {
			return
		}

		_disposeInstance(instance)
		Object.defineProperty(instance, RECYCLE_FIELD, {
			get() {
				return true
			},
			configurable: true,
		})
		pool.push(instance)
	}

	function _disposeInstance(instance: T) {
		disposeMethod && disposeMethod(instance)
	}

	/**
	 * create an instance
	 * @param params  any params
	 */
	function getInstance(...params): T {
		let instance: T
		if (pool.length == 0) {
			instance = factoryMethod.apply(null, params)
		} else {
			instance = pool.pop()
		}
		const args = params.concat()
		args.unshift(instance)
		initializationMethod && initializationMethod.apply(null, args)
		Object.defineProperty(instance, RECYCLE_FIELD, {
			get() {
				return false
			},
			configurable: true,
		})
		return instance
	}

	/**
	 * recycle an instance
	 * @param instance
	 */
	function recycleInstance(instance: T | T[]) {
		if (Array.isArray(instance)) {
			for (let item of instance) {
				_recycle(item)
			}
		} else {
			_recycle(instance)
		}
	}

	/**
	 * clear all instances in pool
	 */
	function clear() {
		while (pool.length > 0) {
			_disposeInstance(pool.pop())
		}
	}

	clears.push(clear)

	return [getInstance, recycleInstance, clear]
}
