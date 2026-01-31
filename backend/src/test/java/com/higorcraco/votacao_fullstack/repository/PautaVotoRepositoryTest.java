package com.higorcraco.votacao_fullstack.repository;

import java.util.UUID;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@Sql(scripts = {
        "/sql/usuario-test-data.sql",
        "/sql/pauta-test-data.sql",
        "/sql/pauta-voto-test-data.sql"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class PautaVotoRepositoryTest {

    @Autowired
    private PautaVotoRepository pautaVotoRepository;

    @ParameterizedTest
    @CsvSource({
            "550e8400-e29b-41d4-a716-446655440010, 550e8400-e29b-41d4-a716-446655440000, true",
            "550e8400-e29b-41d4-a716-446655440010, 550e8400-e29b-41d4-a716-446655440001, true",
            "550e8400-e29b-41d4-a716-446655440011, 550e8400-e29b-41d4-a716-446655440000, true",
            "550e8400-e29b-41d4-a716-446655440012, 550e8400-e29b-41d4-a716-446655440002, false",
            "550e8400-e29b-41d4-a716-446655440099, 550e8400-e29b-41d4-a716-446655440000, false",
            "550e8400-e29b-41d4-a716-446655440010, 550e8400-e29b-41d4-a716-446655440099, false"
    })
    void existsByPautaIdAndUsuarioId(String pautaIdStr, String usuarioIdStr, boolean expectedResult) {
        UUID pautaId = UUID.fromString(pautaIdStr);
        UUID usuarioId = UUID.fromString(usuarioIdStr);

        boolean existe = pautaVotoRepository.existsByPautaIdAndUsuarioId(pautaId, usuarioId);

        assertThat(existe).isEqualTo(expectedResult);
    }
}