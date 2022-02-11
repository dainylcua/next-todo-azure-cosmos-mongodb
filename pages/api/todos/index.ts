import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { ResponseFuncs } from "../../../utils/types"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Capture request method: typed as key of ResponseFunc
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  // Catch error function
  const catcher = (error: Error) => res.status(400).json({ error })

  // Response possibilities
  const handleCase: ResponseFuncs = {
    // GET requests
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect()
      res.json(await Todo.find({}).catch(catcher))
    },

    // POST requests
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect()
      res.json(await Todo.create(req.body).catch(catcher))
    }
  }
  const response = handleCase[method]
  if (response) response(req,res)
  else res.status(400).json(({ error: "No response for this request"}))
}

export default handler