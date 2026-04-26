import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedExams1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO exam (name, description, preparation_instructions, duration_minutes, price, is_active)
      VALUES
        (
          'Hemograma Completo',
          'Análise quantitativa e qualitativa das células sanguíneas: eritrócitos, leucócitos e plaquetas.',
          'Jejum de 4 horas. Evitar esforço físico intenso nas 24h anteriores.',
          30, 45.90, true
        ),
        (
          'Glicemia em Jejum',
          'Medição da concentração de glicose no sangue após período de jejum para rastreamento de diabetes.',
          'Jejum mínimo de 8 horas. Apenas água é permitida.',
          15, 22.50, true
        ),
        (
          'Perfil Lipídico Completo',
          'Dosagem de colesterol total, HDL, LDL, VLDL e triglicerídeos. Avalia risco cardiovascular.',
          'Jejum de 12 horas. Evitar álcool 72h antes.',
          20, 65.00, true
        ),
        (
          'TSH e T4 Livre',
          'Avaliação da função tireoidiana: hormônio estimulante da tireoide e tiroxina livre.',
          'Sem necessidade de jejum. Informar uso de medicamentos tireoidianos.',
          20, 78.00, true
        ),
        (
          'Raio-X de Tórax',
          'Imagem radiológica do tórax para avaliação de pulmões, coração e estruturas ósseas.',
          'Remover acessórios metálicos. Informar possibilidade de gravidez.',
          20, 95.00, true
        ),
        (
          'Eletrocardiograma (ECG)',
          'Registro da atividade elétrica do coração para detecção de arritmias e outras condições cardíacas.',
          'Evitar cremes na pele do tórax. Informar medicamentos em uso.',
          30, 120.00, true
        ),
        (
          'Ultrassonografia Abdominal Total',
          'Exame de imagem para avaliação dos órgãos abdominais: fígado, vesícula, pâncreas, baço e rins.',
          'Jejum de 6 horas. Beber 4 copos de água 1 hora antes, sem urinar.',
          45, 180.00, true
        ),
        (
          'Urina Tipo I (EAS)',
          'Análise física, química e microscópica da urina para avaliação renal e detecção de infecções.',
          'Coletar jato médio da primeira urina da manhã em frasco estéril.',
          15, 18.00, true
        ),
        (
          'Ressonância Magnética de Coluna Lombar',
          'Imagem detalhada da coluna lombar para diagnóstico de hérnias, artrose e outras patologias.',
          'Remover todos os objetos metálicos. Informar implantes metálicos ou marcapasso.',
          60, 650.00, true
        ),
        (
          'Densitometria Óssea',
          'Medição da densidade mineral óssea para diagnóstico de osteoporose e osteopenia.',
          'Não realizar exames com contraste nos 7 dias anteriores. Não tomar cálcio no dia do exame.',
          30, 210.00, true
        )
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM exam
      WHERE name IN (
        'Hemograma Completo',
        'Glicemia em Jejum',
        'Perfil Lipídico Completo',
        'TSH e T4 Livre',
        'Raio-X de Tórax',
        'Eletrocardiograma (ECG)',
        'Ultrassonografia Abdominal Total',
        'Urina Tipo I (EAS)',
        'Ressonância Magnética de Coluna Lombar',
        'Densitometria Óssea'
      );
    `);
  }
}
