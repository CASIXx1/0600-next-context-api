type Project = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "archived";
  color: string;
  goal: string;
  shouldbe: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    total: number;
    kinds: {
      milestone: number;
      task: number;
      total: number;
    };
    states: {
      scheduled: number;
      completed: number;
      archived: number;
    };
  };
  milestones: string[];
};

const sampleProjects: Project[] = [
  {
    id: "01aae611-e02f-46d7-997f-d88cd7842c01",
    name: "プログラミング",
    slug: "programming",
    status: "active",
    color: "#00008c60",
    goal: "期限日までにフロントエンドエンジニアとして就職する。",
    shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
    deadline: "2026-05-08T00:00:00.000Z",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
    stats: {
      total: 132,
      kinds: {
        milestone: 4,
        task: 30,
        total: 34,
      },
      states: {
        scheduled: 30,
        completed: 1,
        archived: 3,
      },
    },
    milestones: [],
  },
  {
    id: "9a75b860-8587-4a78-98f8-39fae76b82df",
    name: "英語",
    slug: "english",
    status: "active",
    color: "#0019ff99",
    goal: "IELTS Overall 7.0 を取得する。",
    shouldbe: "英語に浸る。",
    deadline: "2026-05-15T00:00:00.000Z",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
    stats: {
      total: 132,
      kinds: {
        milestone: 4,
        task: 30,
        total: 34,
      },
      states: {
        scheduled: 30,
        completed: 1,
        archived: 3,
      },
    },
    milestones: [],
  },
  {
    id: "f0647d45-78ec-4eb3-b432-712c3131a080",
    name: "プライベート",
    slug: "private",
    status: "active",
    color: "#00a5ff99",
    goal: "長期休みに旅行をする",
    shouldbe: "",
    deadline: "2026-05-22T00:00:00.000Z",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
    stats: {
      total: 132,
      kinds: {
        milestone: 4,
        task: 30,
        total: 34,
      },
      states: {
        scheduled: 30,
        completed: 1,
        archived: 3,
      },
    },
    milestones: [],
  },
];

export function ProjectList() {
  return (
    <section>
      <h1>プロジェクト</h1>
      <p>1 / 1 ({sampleProjects.length} 件)</p>
      <label>
        <input type="checkbox" />
        アーカイブを表示
      </label>

      <ul>
        {sampleProjects.map((project) => (
          <li key={project.id}>
            <article>
              <h2>{project.name}</h2>
              <dl>
                <div>
                  <dt>ID</dt>
                  <dd>{project.id}</dd>
                </div>
                <div>
                  <dt>Slug</dt>
                  <dd>{project.slug}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </div>
                <div>
                  <dt>Color</dt>
                  <dd>{project.color}</dd>
                </div>
                <div>
                  <dt>Goal</dt>
                  <dd>{project.goal}</dd>
                </div>
                <div>
                  <dt>Shouldbe</dt>
                  <dd>{project.shouldbe || "未設定"}</dd>
                </div>
                <div>
                  <dt>Deadline</dt>
                  <dd>{project.deadline}</dd>
                </div>
                <div>
                  <dt>Created At</dt>
                  <dd>{project.createdAt}</dd>
                </div>
                <div>
                  <dt>Updated At</dt>
                  <dd>{project.updatedAt}</dd>
                </div>
                <div>
                  <dt>Stats Total</dt>
                  <dd>{project.stats.total}</dd>
                </div>
                <div>
                  <dt>Stats Kinds</dt>
                  <dd>
                    milestone: {project.stats.kinds.milestone}, task: {project.stats.kinds.task}, total:{" "}
                    {project.stats.kinds.total}
                  </dd>
                </div>
                <div>
                  <dt>Stats States</dt>
                  <dd>
                    scheduled: {project.stats.states.scheduled}, completed: {project.stats.states.completed}, archived:{" "}
                    {project.stats.states.archived}
                  </dd>
                </div>
                <div>
                  <dt>Milestones</dt>
                  <dd>{project.milestones.length} 件</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
