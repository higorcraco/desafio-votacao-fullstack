package com.higorcraco.votacao_fullstack.controller;

import java.util.List;

import com.higorcraco.votacao_fullstack.service.ReadOnlyService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public abstract class ReadOnlyResource<T, ID> {

    @Getter
    @Autowired
    private ReadOnlyService<T, ID> service;

    protected <S extends ReadOnlyService<T, ID>> S getService(Class<S> clazz) {
        return (S) service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable ID id) {
        return ResponseEntity.ok(service.findByIdThrow(id));
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    public ResponseEntity<Page<T>> findAll(Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }
}
