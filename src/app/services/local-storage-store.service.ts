import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageStoreService {
	createCollection<T>(key: string, seed: T[]): WritableSignal<T[]> {
		const collection = signal<T[]>(this.readCollection(key, seed));

		return collection;
	}

	saveCollection<T>(key: string, value: T[]): void {
		if (!this.canUseStorage()) {
			return;
		}

		localStorage.setItem(key, JSON.stringify(value));
	}

	private readCollection<T>(key: string, seed: T[]): T[] {
		if (!this.canUseStorage()) {
			return [...seed];
		}

		const raw = localStorage.getItem(key);

		if (!raw) {
			this.saveCollection(key, seed);
			return [...seed];
		}

		try {
			const parsed: unknown = JSON.parse(raw);
			return Array.isArray(parsed) ? (parsed as T[]) : [...seed];
		} catch {
			this.saveCollection(key, seed);
			return [...seed];
		}
	}

	private canUseStorage(): boolean {
		return typeof localStorage !== 'undefined';
	}
}
