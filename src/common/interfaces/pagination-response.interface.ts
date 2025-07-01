

export interface PaginationMetadataformat {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}



export interface PaginationResponse <T> {
    items: T[];
    metadata: PaginationMetadataformat;
}


     