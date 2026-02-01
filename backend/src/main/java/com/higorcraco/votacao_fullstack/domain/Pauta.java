package com.higorcraco.votacao_fullstack.domain;

import java.time.LocalDateTime;
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

    private String descricao;

    private Long duracao = 1L;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    private LocalDateTime dataFinalVotacao;

    @OneToMany(mappedBy = "pauta")
    private List<PautaVoto> votos = new ArrayList<>();

    public PautaStatusEnum getStatus() {
        return LocalDateTime.now().isAfter(dataFinalVotacao)
                ? PautaStatusEnum.FINALIZADA
                : PautaStatusEnum.EM_VOTACAO;
    }
}
