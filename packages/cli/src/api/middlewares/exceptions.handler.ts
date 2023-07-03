import {NextFunction, Request, Response} from 'express'

/**
 * Middleware de gestion globale des erreurs
 *
 * @param err - L'erreur Express (peut être la notre ou une autre)
 * @param req - La requête initiale
 * @param res - L'objet de réponse
 * @param next - Permet de passer au middleware suivant si existant
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const ExceptionsHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  /**
   * Voir "The default error handler" dans la doc officielle indiquée plus haut
   */
  if (res.headersSent) {
    return next(err)
  }

  /**
   * Dans les autres cas, on retourne une 500
   */
  return res
    .status(err.status || 500)
    .json({error: err})
}
