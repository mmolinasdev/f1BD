package com.formula1.model.dto;

import java.util.List;

public class PaginatedResponseDTO<T> {
    private List<T> content;
    private long total;
    private int page;
    private int size;
    private int totalPages;

    public PaginatedResponseDTO(List<T> content, long total, int page, int size) {
        this.content = content;
        this.total = total;
        this.page = page;
        this.size = size;
        this.totalPages = (int) Math.ceil((double) total / size);
    }

    public List<T> getContent() { return content; }
    public long getTotal() { return total; }
    public int getPage() { return page; }
    public int getSize() { return size; }
    public int getTotalPages() { return totalPages; }
}
