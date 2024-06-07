import { type Ref, ref } from 'vue';

import { fetchApi } from './misc';
import { type IRawNoviObject, type IRawPartialNoviObject } from './model';

const EXPIRE_TIME = 1000 * 30;

export interface IPartialNoviObject extends IRawPartialNoviObject {
  tags: Record<string, string | null>;

  has(tag: string): boolean;
  get(tag: string): string | null;
  set(tag: string, value: string | null): Promise<void>;
  url(...prefs: string[]): string;

  subtags(prefix: string): Record<string, string | null>;

  get size(): [number, number];
  get expired(): boolean;
}

export interface INoviObject extends IPartialNoviObject, IRawNoviObject {}

export class NoviObject implements IPartialNoviObject {
  id: string;
  tags: Record<string, string | null>;
  created?: string;
  updated?: string;
  creator?: string | null;

  inserted: number;

  private static instances: Record<string, NoviObject> = {};
  private static storageKey(id: string) {
    return `o-${id}`;
  }

  private constructor(raw: IRawPartialNoviObject) {
    this.id = raw.id;
    this.tags = raw.tags;
    if ('created' in raw) {
      let full = raw as IRawNoviObject;
      this.created = full.created;
      this.updated = full.updated;
      this.creator = full.creator;
    }
    this.inserted = raw.inserted ?? Date.now();
    NoviObject.instances[this.id] = this;
    this.saveLocal();
  }

  private assign(raw: IRawPartialNoviObject) {
    if ('updated' in raw) {
      if ('updated' in this && this.updated === raw.updated) return;
      Object.assign(this, raw);
    } else this.tags = { ...raw.tags };
    this.inserted = Date.now();
    this.saveLocal();
  }

  url(...prefs: string[]) {
    if (!prefs.length) prefs.push('original');
    let url = `/api/files/${this.id}/${prefs.join(',')}`;
    if (window.ipfsGateway)
      url += '?gateway=' + encodeURIComponent(String(window.ipfsGateway));
    return url;
  }

  private saveLocal() {
    sessionStorage.setItem(NoviObject.storageKey(this.id), JSON.stringify(this));
  }

  has(tag: string) {
    return tag in this.tags;
  }

  get(tag: string) {
    return this.tags[tag];
  }

  get size() {
    return (this.tags['@res']?.split('x').map(Number) as [number, number]) ?? [0, 0];
  }

  async set(tag: string, value: string | null): Promise<void> {
    this.assign(
      await fetchApi(`/objects/${this.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [tag]: value })
      })
    );
  }

  get expired() {
    return Date.now() - this.inserted > EXPIRE_TIME;
  }

  get isPartial(): boolean {
    return !('created' in this);
  }

  subtags(prefix: string): Record<string, string | null> {
    prefix += ':';
    let res: Record<string, string | null> = {};
    for (let tag in this.tags)
      if (tag.startsWith(prefix)) res[tag.slice(prefix.length)] = this.tags[tag];
    return res;
  }

  static fetchLocal(id: string): NoviObject | null {
    if (id in NoviObject.instances) return NoviObject.instances[id];
    let item = sessionStorage.getItem(NoviObject.storageKey(id));
    if (!item) return null;
    let obj = new NoviObject(JSON.parse(item));
    if (obj.expired) {
      delete NoviObject.instances[id];
      sessionStorage.removeItem(NoviObject.storageKey(id));
      return null;
    }
    return obj;
  }

  static async fetchPartial(id: string): Promise<IPartialNoviObject> {
    let object = NoviObject.fetchLocal(id);
    if (object) return object;
    return await NoviObject.fetch(id);
  }

  static async fetch(id: string): Promise<INoviObject> {
    let object = NoviObject.fetchLocal(id);
    if (object && !object.isPartial) return object as INoviObject;
    return await navigator.locks.request('novi-object-' + id, async () => {
      return new NoviObject(await fetchApi(`/objects/${id}`));
    });
  }

  static fromRaw(raw: IRawPartialNoviObject) {
    let object = NoviObject.fetchLocal(raw.id);
    if (object) {
      object.assign(raw);
      return object;
    }
    return new NoviObject(raw);
  }

  static fetchRef(id: string): Ref<INoviObject | undefined> {
    const res = ref<INoviObject>();
    this.fetch(id).then((obj) => (res.value = obj));
    return res;
  }

  static fetchPartialRef(id: string): Ref<IPartialNoviObject | undefined> {
    const res = ref<IPartialNoviObject>();
    this.fetchPartial(id).then((obj) => (res.value = obj));
    return res;
  }
}
