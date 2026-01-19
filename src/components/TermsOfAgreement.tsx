import { Separator } from '@/components/ui/separator'

export function TermsOfAgreement() {
  return (
    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
      <div className="space-y-2">
        <h4 className="font-bold text-foreground">
          TERMO DE ADESÃO À REDE ESCUTAPSI
        </h4>
        <p>
          Este documento estabelece as condições de adesão do profissional à
          plataforma EscutaPsi. Ao aceitar este termo, você concorda
          expressamente com as cláusulas abaixo.
        </p>
      </div>

      <Separator />

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">1. Objeto</h5>
        <p>
          1.1. O presente Termo tem por objeto a adesão do(a) PROFISSIONAL à
          plataforma ESCUTAPSI, visando a divulgação de seu perfil profissional
          para oferta de serviços de psicanálise e/ou psicologia a interessados
          ("PACIENTES").
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">
          2. Requisitos Profissionais
        </h5>
        <p>
          2.1. O PROFISSIONAL declara ser plenamente capaz e possuir habilitação
          legal e/ou formação teórica e clínica necessária para o exercício da
          psicanálise ou psicologia.
        </p>
        <p>
          2.2. No caso de psicólogos, declara estar com seu registro ativo e
          regular junto ao Conselho Regional de Psicologia (CRP). Psicanalistas
          declaram possuir formação reconhecida pelo tripé psicanalítico
          (análise pessoal, supervisão e estudo teórico).
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">
          3. Compromissos Éticos e Profissionais
        </h5>
        <p>
          3.1. O PROFISSIONAL compromete-se a atuar com ética, responsabilidade
          e respeito à singularidade de cada paciente, observando os princípios
          fundamentais dos Direitos Humanos.
        </p>
        <p>
          3.2. É dever inalienável do PROFISSIONAL manter sigilo absoluto sobre
          as informações tratadas em sessão, conforme os códigos de ética
          vigentes.
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">
          4. Atendimentos e Valores
        </h5>
        <p>
          4.1. O PROFISSIONAL concorda em oferecer atendimentos conforme os
          valores e modalidades (Online e/ou Presencial) informados em seu
          perfil na plataforma.
        </p>
        <p>
          4.2. A negociação de pagamentos, agendamentos e eventuais reposições
          ocorre diretamente entre PROFISSIONAL e PACIENTE, isentando a
          ESCUTAPSI de qualquer intermediação ou responsabilidade financeira.
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">
          5. Autonomia Profissional
        </h5>
        <p>
          5.1. O PROFISSIONAL possui total autonomia técnica para conduzir os
          tratamentos, não havendo qualquer vínculo empregatício, subordinação
          ou ingerência técnica por parte da ESCUTAPSI.
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">
          6. Uso de Nome e Imagem
        </h5>
        <p>
          6.1. O PROFISSIONAL autoriza a ESCUTAPSI a utilizar seu nome, imagem,
          minibiografia e demais dados profissionais inseridos na plataforma
          para fins de divulgação e promoção da rede de atendimento.
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">
          7. Vigência e Desligamento
        </h5>
        <p>7.1. A adesão a este termo é por tempo indeterminado.</p>
        <p>
          7.2. Ambas as partes podem encerrar a parceria a qualquer momento,
          mediante exclusão do perfil na plataforma ou solicitação formal, sem
          cobrança de multas ou ônus.
        </p>
      </section>

      <section className="space-y-1">
        <h5 className="font-semibold text-foreground">8. Disposições Gerais</h5>
        <p>
          8.1. A ESCUTAPSI poderá alterar os termos deste instrumento a qualquer
          momento, comprometendo-se a notificar os profissionais sobre mudanças
          relevantes.
        </p>
        <p>
          8.2. Ao marcar a opção "Li e concordo", o PROFISSIONAL declara ter
          lido, compreendido e aceito integralmente todas as cláusulas deste
          termo.
        </p>
      </section>
    </div>
  )
}
