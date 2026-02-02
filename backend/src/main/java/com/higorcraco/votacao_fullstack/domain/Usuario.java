package com.higorcraco.votacao_fullstack.domain;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.br.CPF;

@Table(
        name = "usuario",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_cpf", columnNames = {"cpf"})
        }
)
@Entity
@Data
@EqualsAndHashCode(of = "id")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CPF
    private String cpf;
}
