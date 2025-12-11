import { ShieldCheck } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-6 mb-10">
        <div className="flex items-center gap-3 text-primary mb-2">
          <ShieldCheck className="w-8 h-8" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Proteção de Dados
          </span>
        </div>
        <h1 className="text-4xl font-heading font-bold text-foreground">
          Política de Privacidade
        </h1>
        <p className="text-lg text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <Separator className="my-8" />

      <div className="prose prose-gray max-w-none space-y-8 text-foreground/80">
        <section>
          <p className="lead text-lg">
            A sua privacidade é fundamental para a EscutaPSI. Esta Política de
            Privacidade descreve como coletamos, usamos, armazenamos e
            protegemos suas informações pessoais, em conformidade com a Lei
            Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            1. Informações que Coletamos
          </h2>
          <p>
            Coletamos informações necessárias para fornecer nossos serviços e
            melhorar sua experiência:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Dados de Identificação:</strong> Nome, e-mail, telefone,
              CPF (para profissionais).
            </li>
            <li>
              <strong>Dados Profissionais:</strong> Formação acadêmica, registro
              profissional (CRP/CRP), especialidades, biografia e foto.
            </li>
            <li>
              <strong>Dados de Navegação:</strong> Endereço IP, tipo de
              navegador, páginas visitadas e tempo de permanência (via cookies).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            2. Como Usamos seus Dados
          </h2>
          <p>Utilizamos suas informações para as seguintes finalidades:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Conexão:</strong> Permitir que pacientes encontrem e
              entrem em contato com profissionais.
            </li>
            <li>
              <strong>Comunicação:</strong> Enviar notificações, atualizações de
              serviço e responder a solicitações de suporte.
            </li>
            <li>
              <strong>Segurança:</strong> Verificar a identidade dos
              profissionais e garantir a segurança da plataforma.
            </li>
            <li>
              <strong>Melhorias:</strong> Analisar o uso da plataforma para
              desenvolver novas funcionalidades e aprimorar a experiência do
              usuário.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            3. Compartilhamento de Dados
          </h2>
          <p>
            Não vendemos suas informações pessoais. Seus dados podem ser
            compartilhados apenas nas seguintes circunstâncias:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Perfil Público:</strong> As informações profissionais
              (nome, foto, especialidades, contato) são públicas para permitir a
              busca por pacientes.
            </li>
            <li>
              <strong>Obrigações Legais:</strong> Quando exigido por lei ou
              ordem judicial.
            </li>
            <li>
              <strong>Prestadores de Serviço:</strong> Empresas parceiras que
              nos auxiliam na operação da plataforma (ex: hospedagem, envio de
              e-mails), sob estritas obrigações de confidencialidade.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            4. Segurança dos Dados
          </h2>
          <p>
            Empregamos medidas técnicas e organizacionais adequadas para
            proteger seus dados contra acesso não autorizado, perda, alteração
            ou divulgação. Utilizamos criptografia SSL/TLS em todas as
            comunicações e armazenamos dados em servidores seguros.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            5. Seus Direitos
          </h2>
          <p>De acordo com a LGPD, você tem direito a:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Confirmar a existência de tratamento de dados.</li>
            <li>Acessar seus dados pessoais.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>
              Solicitar a anonimização, bloqueio ou eliminação de dados
              desnecessários.
            </li>
            <li>Revogar seu consentimento a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            6. Cookies
          </h2>
          <p>
            Utilizamos cookies para melhorar a funcionalidade do site e analisar
            o tráfego. Você pode configurar seu navegador para recusar cookies,
            mas isso pode limitar algumas funcionalidades da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            7. Contato sobre Privacidade
          </h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre nossa
            Política de Privacidade, entre em contato com nosso Encarregado de
            Dados (DPO) pelo e-mail: privacidade@escutapsi.com.br
          </p>
        </section>
      </div>
    </div>
  )
}
