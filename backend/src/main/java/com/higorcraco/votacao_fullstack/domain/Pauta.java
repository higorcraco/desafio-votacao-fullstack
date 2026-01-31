package com.higorcraco.votacao_fullstack.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.enums.PautaStatusEnum;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Table(name = "pauta")
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

    @OneToMany(mappedBy = "pauta", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PautaVoto> votos = new ArrayList<>();

    public PautaStatusEnum getStatus() {
        return LocalDateTime.now().isAfter(dataFinalVotacao)
                ? PautaStatusEnum.FINALIZADA
                : PautaStatusEnum.EM_VOTACAO;
    }
}
