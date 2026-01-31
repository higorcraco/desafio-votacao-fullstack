package com.higorcraco.votacao_fullstack.service;

import java.util.List;

import com.higorcraco.votacao_fullstack.exception.NotFoundException;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public abstract class ReadOnlyService<T, ID> {

    @Getter
    @Autowired
    private JpaRepository<T, ID> repository;

    protected <R extends JpaRepository<T, ID>> R getRepository(Class<R> clazz) {
        return (R) repository;
    }

    public T findById(ID id) {
        return repository.findById(id).orElse(null);
    }

    public T findByIdThrow(ID id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(
                String.format("%s com id %s não encontrado",
                        this.getClass().getSimpleName().replace("Service", ""), id)
        ));
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
