package com.higorcraco.votacao_fullstack.domain;

import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Table(
    name = "pauta_voto",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_pauta_usuario", columnNames = {"pauta_id", "usuario_id"})
        }
)
@Entity
@Data
@EqualsAndHashCode(of = "id")
public class PautaVoto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pauta_id")
    private Pauta pauta;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
