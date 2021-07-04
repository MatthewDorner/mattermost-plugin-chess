export declare type $ID<E extends {
    id: string;
}> = E['id'];
export declare type $UserID<E extends {
    user_id: string;
}> = E['user_id'];
export declare type $Name<E extends {
    name: string;
}> = E['name'];
export declare type $Username<E extends {
    username: string;
}> = E['username'];
export declare type $Email<E extends {
    email: string;
}> = E['email'];
export declare type RelationOneToOne<E extends {
    id: string;
}, T> = {
    [x in $ID<E>]: T;
};
export declare type RelationOneToMany<E1 extends {
    id: string;
}, E2 extends {
    id: string;
}> = {
    [x in $ID<E1>]: Array<$ID<E2>>;
};
export declare type IDMappedObjects<E extends {
    id: string;
}> = RelationOneToOne<E, E>;
export declare type UserIDMappedObjects<E extends {
    user_id: string;
}> = {
    [x in $UserID<E>]: E;
};
export declare type NameMappedObjects<E extends {
    name: string;
}> = {
    [x in $Name<E>]: E;
};
export declare type UsernameMappedObjects<E extends {
    username: string;
}> = {
    [x in $Username<E>]: E;
};
export declare type EmailMappedObjects<E extends {
    email: string;
}> = {
    [x in $Email<E>]: E;
};
export declare type Dictionary<T> = {
    [key: string]: T;
};
