package com.higorcraco.votacao_fullstack.controller;

import com.higorcraco.votacao_fullstack.dto.converter.DtoConverter;
import com.higorcraco.votacao_fullstack.service.ReadOnlyService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public abstract class ReadOnlyController<T, ID, D> {

    @Getter
    @Autowired
    private ReadOnlyService<T, ID> service;

    @Autowired
    private DtoConverter<T, D> dtoConverter;

    protected <S extends ReadOnlyService<T, ID>> S getService(Class<S> clazz) {
        return (S) service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<D> findById(@PathVariable ID id) {
        D dto = dtoConverter.from(service.findByIdThrow(id));

        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<Page<D>> findAll(Pageable pageable) {
        Page<D> dtoPage = service.findAll(pageable).map(dtoConverter::from);

        return ResponseEntity.ok(dtoPage);
    }
}
