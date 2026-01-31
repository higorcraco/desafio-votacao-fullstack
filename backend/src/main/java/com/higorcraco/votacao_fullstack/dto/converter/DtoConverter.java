package com.higorcraco.votacao_fullstack.dto.converter;

public interface DtoConverter<T, D> {

    T to(D dto);
    D from(T entity);
}
