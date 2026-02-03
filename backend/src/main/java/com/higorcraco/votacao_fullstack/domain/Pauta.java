package com.higorcraco.votacao_fullstack.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.enums.PautaStatusEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Table(name = "pauta", indexes = {
        @Index(name = "idx_data_criacao", columnList = "data_criacao"),
        @Index(name = "idx_data_final_votacao", columnList = "data_final_votacao")
})
@Entity
@Data
@EqualsAndHashCode(of = "id")
public class Pauta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    private String titulo;

    private String descricao;

    @NotNull
    private Long duracao = 1L;

    @NotNull
    private Instant dataCriacao = Instant.now();

    @NotNull
    private Instant dataFinalVotacao;

    @OneToMany(mappedBy = "pauta")
    private List<PautaVoto> votos = new ArrayList<>();

    public PautaStatusEnum getStatus() {
        return Instant.now().isAfter(dataFinalVotacao)
                ? PautaStatusEnum.FINALIZADA
                : PautaStatusEnum.EM_VOTACAO;
    }
}
