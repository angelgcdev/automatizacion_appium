export const commentModalSelectors = {
  commentButton:
    '//android.widget.Button[contains(@content-desc, "Leer o añadir comentarios")]',
  commentInput: 'android=new UiSelector().textContains("Añadir comentario")',
  commentInputField:
    'android=new UiSelector().textContains("Añadir comentario")',
  commentPublicButton: "~Publicar comentario",
  commentCloseButton: "~Cerrar",
};
