// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import FormData from 'form-data'
import { api } from '../../../services/api'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID as string;
    const client_secret = process.env.SECRET_ID as string;
    const { code } = req.query as { code: string };
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI as string;
    const scope = "connections"
    const grant_type = "authorization_code"
    const formData = new FormData();
    formData.append('client_id', client_id);
    const data: Record<string, string> = {
      client_id,
      client_secret,
      code,
      redirect_uri,
      scope,
      grant_type,
    };

    Object.keys(data).forEach(key => {
      const value = data[key] as string;
      formData.append(key, value);
    })

    const { data: { access_token } } = await api.post<{ access_token: string }>('/oauth2/token',
      formData, {
      headers: formData.getHeaders(),
    })
    const Authorization = `Bearer ${access_token}`;

    const { data: { id }
    } = await api.get<{ id: string }>('/users/@me', { headers: { Authorization } })

    await api.put(`/guilds/${process.env.GUILD_ID}/members/${id}/roles/${process.env.ROLE_ID}`, {
    }, {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` }
    })

  } catch (error:any) {
    console.log(error?.response?.data || error?.response || error);

  }
  res.status(200).json({ name: 'John Doe' })
}
