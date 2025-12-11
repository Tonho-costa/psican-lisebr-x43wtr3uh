import { ScrollText } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-6 mb-10">
        <div className="flex items-center gap-3 text-primary mb-2">
          <ScrollText className="w-8 h-8" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Documentação Legal
          </span>
        </div>
        <h1 className="text-4xl font-heading font-bold text-foreground">
          Termos de Uso
        </h1>
        <p className="text-lg text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <Separator className="my-8" />

      <div className="prose prose-gray max-w-none space-y-8 text-foreground/80">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            1. Aceitação dos Termos
          </h2>
          <p>
            Ao acessar e utilizar a plataforma EscutaPSI, você concorda em
            cumprir e estar vinculado aos seguintes termos e condições de uso.
            Se você não concordar com qualquer parte destes termos, não deverá
            utilizar nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            2. Descrição do Serviço
          </h2>
          <p>
            A EscutaPSI é uma plataforma online que atua como intermediária,
            facilitando a conexão entre profissionais de psicanálise e
            psicologia ("Profissionais") e indivíduos interessados em seus
            serviços ("Pacientes" ou "Usuários").
          </p>
          <p className="mt-2 font-medium">
            Importante: A EscutaPSI não presta serviços de saúde, não realiza
            diagnósticos e não substitui o aconselhamento médico profissional.
            Em caso de emergência, procure o hospital mais próximo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            3. Cadastro e Responsabilidades
          </h2>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            3.1. Para Profissionais
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Devem fornecer informações verídicas, precisas e atualizadas sobre
              sua formação e registro profissional.
            </li>
            <li>
              São inteiramente responsáveis pela qualidade e ética dos serviços
              prestados.
            </li>
            <li>
              Devem manter o sigilo profissional conforme os códigos de ética
              vigentes.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-2">
            3.2. Para Usuários
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Comprometem-se a utilizar a plataforma apenas para fins lícitos.
            </li>
            <li>
              São responsáveis por verificar as credenciais do profissional
              antes de iniciar o tratamento.
            </li>
            <li>
              Devem honrar os agendamentos ou comunicar cancelamentos com
              antecedência.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            4. Propriedade Intelectual
          </h2>
          <p>
            Todo o conteúdo disponibilizado na plataforma, incluindo textos,
            gráficos, logotipos, ícones, imagens e software, é propriedade da
            EscutaPSI ou de seus licenciadores e é protegido pelas leis de
            direitos autorais e propriedade intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            5. Limitação de Responsabilidade
          </h2>
          <p>
            A EscutaPSI não se responsabiliza por danos diretos, indiretos,
            incidentais ou consequenciais resultantes do uso ou da incapacidade
            de uso do serviço, ou por qualquer conduta de terceiros na
            plataforma. A relação terapêutica é estabelecida exclusivamente
            entre o Profissional e o Paciente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            6. Alterações nos Termos
          </h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer
            momento. As alterações entrarão em vigor imediatamente após sua
            publicação na plataforma. O uso continuado do serviço após as
            alterações constitui aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            7. Contato
          </h2>
          <p>
            Para esclarecer dúvidas sobre estes Termos de Uso, entre em contato
            através do nosso canal de suporte ou pelo e-mail:
            legal@escutapsi.com.br
          </p>
        </section>
      </div>
    </div>
  )
}
