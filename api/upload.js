export default async function handler(req, res) {
  const { summary, scene, mood } = req.body;

  const token = process.env.NOTION_TOKEN;
  const db = process.env.NOTION_DATABASE;

  const payload = {
    parent: { database_id: db },
    properties: {
      "场景标题": {
        title: [{ text: { content: scene } }]
      },
      "日期": {
        date: { start: new Date().toISOString() }
      },
      "角色情绪": {
        select: { name: mood }
      }
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: summary } }]
        }
      }
    ]
  };

  const notionRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (notionRes.ok) {
    res.status(200).json({ success: true });
  } else {
    const error = await notionRes.text();
    res.status(500).json({ message: error });
  }
}
