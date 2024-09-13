export default interface DamageTypeMap<T> {
    [key: string]: T | undefined;
    physical: T;
    magic: T;
    fire: T;
    lightning: T;
    holy: T;
    poison?: T;
    bleed?: T;
    sleep?: T;
    madness?: T;
    "scarlet-rot"?: T;
}
