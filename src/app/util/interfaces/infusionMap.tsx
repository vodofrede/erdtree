export interface InfusionMap<T> {
    [key: string]: T | undefined;
    standard?: T;
    heavy?: T;
    keen?: T;
    quality?: T;
    fire?: T;
    "flame-art"?: T;
    lightning?: T;
    sacred?: T;
    magic?: T;
    cold?: T;
    poison?: T;
    blood?: T;
    occult?: T;
}
