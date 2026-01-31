package com.higorcraco.votacao_fullstack.repository;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@Sql(scripts = "/sql/usuario-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void findByCpf() {
        String cpf = "12345678901";

        Usuario usuario = usuarioRepository.findByCpf(cpf).get();

        assertThat(usuario).isNotNull();
        assertThat(usuario.getCpf()).isEqualTo(cpf);
        assertThat(usuario.getId()).isNotNull();
    }

    @Test
    void findByCpf_quandoCpfNaoExiste_deveRetornarNull() {
        String cpfInexistente = "00000000000";

        assertThat(usuarioRepository.findByCpf(cpfInexistente)).isEmpty();
    }
}