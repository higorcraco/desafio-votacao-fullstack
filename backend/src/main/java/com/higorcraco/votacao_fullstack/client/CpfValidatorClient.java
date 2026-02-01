package com.higorcraco.votacao_fullstack.client;

import java.util.Random;

import com.higorcraco.votacao_fullstack.dto.integracao.CpfStatusDto;
import com.higorcraco.votacao_fullstack.exception.integracao.CpfNaoEncontrado;
import org.springframework.stereotype.Component;

@Component
public class CpfValidatorClient {

    public CpfStatusDto consultaStatus(String cpf) {
        int randomValue = new Random().nextInt(100);

        if (randomValue < 10) {
            throw new CpfNaoEncontrado("Cpf não encontrado no serviço de validação!");
        }

        String status = randomValue > 40 ? "ABLE_TO_VOTE" : "UNABLE_TO_VOTE";

        return new CpfStatusDto(status);
    }
}
