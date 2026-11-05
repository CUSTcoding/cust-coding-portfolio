/**
 * Estado partilhado entre a cena 3D e os painéis de controlo.
 * No script.js original estas variáveis viviam num escopo inacessível aos painéis.
 */
export const engine: {
  model: any;
  modelLoaded: boolean;
  modelCamera: any;
  modelRenderer: any;
} = {
  model: null,
  modelLoaded: false,
  modelCamera: null,
  modelRenderer: null,
};
