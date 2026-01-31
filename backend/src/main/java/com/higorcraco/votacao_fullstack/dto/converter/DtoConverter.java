package com.higorcraco.votacao_fullstack.dto.converter;

public interface DtoConverter<T, D> {

    D from(T entity);
}
