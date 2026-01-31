package com.higorcraco.votacao_fullstack.repository;

import java.util.Optional;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByCpf(String cpf);
}
