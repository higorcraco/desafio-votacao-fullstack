# PMD - Análise Estática de Código

Este projeto utiliza PMD (Project Mess Detector) para análise estática de código Java.

## Sobre o PMD

PMD é uma ferramenta de análise estática que detecta:
- Bugs potenciais
- Código morto
- Loops infinitos
- Variáveis não utilizadas
- Problemas de performance
- Práticas inadequadas

## Configuração

A configuração do PMD está em:
- Plugin: `build.gradle`
- Regras: `config/pmd/ruleset.xml`

## Como usar

### Executar análise do PMD

```bash
./gradlew pmdMain
```

### Gerar relatório HTML

```bash
./gradlew pmdMain
# Relatório gerado em: build/reports/pmd/main.html
```

### Ver erros do PMD na saída

```bash
./gradlew pmdMain --console=plain
```

### Incluir PMD no build

O PMD será executado automaticamente como parte do build se configurado com `ignoreFailures = false`. Para falhar o build quando há violações:

```bash
./gradlew build
```

## Regras Configuradas

O arquivo `config/pmd/ruleset.xml` inclui regras para:

### Tamanho de Código
- Métodos com mais de 100 linhas
- Métodos com mais de 5 parâmetros
- Classes com mais de 500 linhas

### Melhores Práticas
- Uso de `printStackTrace()`
- IPs hardcoded
- Variáveis não utilizadas
- Imports não utilizados

### Erros Potenciais
- Null checks incompletos
- Statements de branch no final de loops
- Conversões desnecessárias
- Falta de `equals()` e `hashCode()`

### Performance
- Uso ineficiente de StringBuilder
- Criação desnecessária de objetos wrapper
- Instanciação de BigInteger/Boolean

## Customizar Regras

Para adicionar ou remover regras, edite `config/pmd/ruleset.xml`. Cada regra pode ter propriedades customizáveis (como limites de tamanho).

## Integração com CI/CD

Para fazer o PMD falhar o build em pipelines:

```groovy
pmd {
    ignoreFailures = false  // Falha o build se houver violações
}
```

## Relatórios

Os relatórios do PMD são gerados em:
- HTML: `build/reports/pmd/main.html`
- XML: `build/reports/pmd/main.xml`
