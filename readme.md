# Easy Object Pool

an easy way to use object pool

## Install

`yarn add easy-object-pool`  
or  
`npm i easy-object-pool -S`

## Usage

```typescript
import {useObjectPool} from 'easy-object-pool'

class Cat {
}

const [getACat, recycleCat] = useObjectPool<Cat>(() => new Cat())

//create a Cat instance
const cat = getACat()

//recycle a Cat instance
recycleCat(cat)
```

## Api

```typescript
function useObjectPool<T>(options: {
	factoryMethod: (...params: any[]) => T;
	initializationMethod?: (instance: T, ...params: any[]) => void;
	disposeMethod?: (instance: T, ...params: any[]) => void;
	preInstantiationQuantity?: number;
	limit?: number;
}): [(...params: any[]) => T, (instance: T | T[]) => void, () => void];
```

### Options interface

| field | type | required | default | description |
| :--- | :--- | :---: | :---: | :--- |
| `factoryMethod` | (...params: any[]) => T | ✅ | | factory method to instantiate a instance |
| `initializationMethod` | (instance: T, ...params: any[]) => void |  | | initialize a instance when get a instance |
| `disposeMethod` | (instance: T, ...params: any[]) => void |  | | call if clean instances |
| `preInstantiationQuantity` | `number` |  | `0` | instantiate some instances at ahead |
| `limit` | `number` |  | `0` | set a limit quantity of pool |

### Returns

`[getAInstance, recycleInstance, cleanAllInstance]`

| field | type | description |
| :--- | :--- | :--- |
| `getAInstance` | (...params: any[]) => T | get a instance |
| `recycleInstance` | (instance: T &#124; T[]) => void | recycle a instance or instances |
| `cleanAllInstance` | () => void | clean all instances |
