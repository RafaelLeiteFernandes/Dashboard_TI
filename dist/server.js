"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://github.com/motdotla/dotenv?sponsor=1",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options) {
        if (options.path != null) {
          let envPath = options.path;
          if (Array.isArray(envPath)) {
            for (const filepath of options.path) {
              if (fs.existsSync(filepath)) {
                envPath = filepath;
                break;
              }
            }
          }
          dotenvPath = _resolveHome(envPath);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        } else {
          if (debug) {
            _debug("No encoding is specified. UTF-8 is used by default");
          }
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        let processEnv = process.env;
        if (options && options.processEnv != null) {
          processEnv = options.processEnv;
        }
        DotenvModule.populate(processEnv, parsed, options);
        return { parsed };
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// src/server.ts
var import_express2 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

// src/routes/index.ts
var import_express = require("express");

// src/models/Tickets.ts
var import_sequelize2 = require("sequelize");

// src/instances/pg.ts
var import_sequelize = require("sequelize");
var import_dotenv = __toESM(require_main());
import_dotenv.default.config();
var sequelize = new import_sequelize.Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DB
  }
);

// src/models/Tickets.ts
var Tickets = sequelize.define("glpi_tickets", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: import_sequelize2.DataTypes.INTEGER
  },
  name: {
    type: import_sequelize2.DataTypes.STRING
  },
  date: {
    type: import_sequelize2.DataTypes.DATE
  },
  closedate: {
    type: import_sequelize2.DataTypes.DATE
  },
  status: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  itilcategories_id: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  date_creation: {
    type: import_sequelize2.DataTypes.DATE
  }
}, {
  tableName: "glpi_tickets",
  timestamps: false
});

// src/controllers/AllTickets.controller.ts
var getAllTickets = async (req, res) => {
  try {
    const list = await Tickets.findAll();
    res.json({
      list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter os tickets." });
  }
};

// src/controllers/SumAllTickets.controller.ts
var getSumOfTicketsClosed = async (req, res) => {
  try {
    const countOfItems = await Tickets.count({
      where: {
        status: 6,
        is_deleted: 0
      }
    });
    res.json({ countOfItems });
  } catch (error) {
    console.error("Erro ao contar o n\xFAmero de itens com situa\xE7\xE3o igual a fechado:", error);
    res.status(500).json({ error: "Erro ao contar o n\xFAmero de itens com situa\xE7\xE3o igual a fechado." });
  }
};

// src/controllers/CloseWeekTickets.controller.ts
var import_sequelize3 = require("sequelize");
var getSumOfTicketsClosedThisWeek = async (req, res) => {
  try {
    const now = /* @__PURE__ */ new Date();
    const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    const countOfClosedTickets = await Tickets.count({
      where: {
        status: 6,
        // Supondo que o status 6 representa tickets fechados
        closedate: {
          [import_sequelize3.Op.between]: [firstDayOfWeek, lastDayOfWeek]
        }
      }
    });
    res.json({ countOfClosedTickets });
  } catch (error) {
    console.error("Erro ao calcular a soma de tickets fechados nesta semana:", error);
    res.status(500).json({ error: "Erro ao calcular a soma de tickets fechados nesta semana." });
  }
};

// src/controllers/OpenTickets.controller.ts
var import_sequelize4 = require("sequelize");
var sequelize2 = new import_sequelize4.Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: "localhost",
  dialect: "mysql"
});
var getOpenTickets = async (req, res) => {
  try {
    const openTickets = await Tickets.count({
      where: {
        status: {
          [import_sequelize4.Op.in]: [1, 2]
          // Supondo que os status 1 e 2 representam chamados em aberto
        },
        is_deleted: 0
      }
    });
    res.json({ openTickets });
  } catch (error) {
    console.error("Erro ao buscar os tickets em aberto:", error);
    res.status(500).json({ error: "Erro ao buscar os tickets em aberto." });
  }
};

// src/controllers/MonTickets.controller.ts
var import_sequelize5 = require("sequelize");
var sequelize3 = new import_sequelize5.Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: "localhost",
  dialect: "mysql"
});
var getClosedTicketsByMonth = async (req, res) => {
  try {
    const closedTicketsByMonth = await Tickets.findAll({
      attributes: [
        [(0, import_sequelize5.fn)("YEAR", (0, import_sequelize5.col)("solvedate")), "year"],
        [(0, import_sequelize5.fn)("MONTH", (0, import_sequelize5.col)("solvedate")), "month"],
        [(0, import_sequelize5.fn)("COUNT", "*"), "count"]
      ],
      where: {
        status: 6
        // Supondo que o status 6 representa chamados fechados
      },
      group: [(0, import_sequelize5.fn)("YEAR", (0, import_sequelize5.col)("solvedate")), (0, import_sequelize5.fn)("MONTH", (0, import_sequelize5.col)("solvedate"))],
      raw: true
    });
    res.json({ closedTicketsByMonth });
  } catch (error) {
    console.error("Erro ao buscar os chamados fechados por m\xEAs:", error);
    res.status(500).json({ error: "Erro ao buscar os chamados fechados por m\xEAs." });
  }
};

// src/controllers/WeekTickets.controller.ts
var import_sequelize6 = require("sequelize");
var sequelize4 = new import_sequelize6.Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: "localhost",
  dialect: "mysql"
});
var getOpenTicketsThisWeek = async (req, res) => {
  try {
    const now = /* @__PURE__ */ new Date();
    const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    const openTicketsThisWeek = await Tickets.count({
      where: {
        date_creation: {
          [import_sequelize6.Op.between]: [firstDayOfWeek, lastDayOfWeek]
        }
      }
    });
    res.json({ openTicketsThisWeek });
  } catch (error) {
    console.error("Erro ao buscar os chamados abertos nesta semana:", error);
    res.status(500).json({ error: "Erro ao buscar os chamados abertos nesta semana." });
  }
};

// src/controllers/OpenDayTickets.controller.ts
var import_sequelize7 = require("sequelize");
var getTicketsCreatedToday = async (req, res) => {
  try {
    const now = /* @__PURE__ */ new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const ticketsCreatedToday = await Tickets.count({
      where: {
        date_creation: {
          [import_sequelize7.Op.between]: [startOfDay, endOfDay]
        }
      }
    });
    res.json({ ticketsCreatedToday });
  } catch (error) {
    console.error("Erro ao buscar os chamados criados hoje:", error);
    res.status(500).json({ error: "Erro ao buscar os chamados criados hoje." });
  }
};

// src/controllers/CountMonTickets.controller.ts
var import_sequelize8 = require("sequelize");
var sequelize5 = new import_sequelize8.Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: "localhost",
  dialect: "mysql"
});
var getDailyAverageClosedTickets = async (req, res) => {
  try {
    const totalClosedTickets = await Tickets.count({
      where: {
        status: 6,
        is_deleted: 0
        // Supondo que o status 6 representa chamados fechados
      }
    });
    const firstTicketDate = await Tickets.min("date_creation", { plain: true });
    const now = /* @__PURE__ */ new Date();
    const daysSinceStart = Math.ceil((now.getTime() - firstTicketDate) / (1e3 * 3600 * 24));
    const dailyAverage = totalClosedTickets / daysSinceStart;
    res.json({ dailyAverage });
  } catch (error) {
    console.error("Erro ao calcular a m\xE9dia di\xE1ria de chamados fechados:", error);
    res.status(500).json({ error: "Erro ao calcular a m\xE9dia di\xE1ria de chamados fechados." });
  }
};

// src/controllers/TypeTickets.controller.ts
var import_sequelize9 = require("sequelize");
var sequelize6 = new import_sequelize9.Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: "localhost",
  dialect: "mysql"
});
var getTicketsByCategory = async (req, res) => {
  try {
    const ticketsByCategory = await Tickets.findAll({
      attributes: ["itilcategories_id", [sequelize6.fn("COUNT", "*"), "count"]],
      group: ["itilcategories_id"]
    });
    res.json({ ticketsByCategory });
  } catch (error) {
    console.error("Erro ao buscar os chamados por motivo:", error);
    res.status(500).json({ error: "Erro ao buscar os chamados por motivo." });
  }
};

// src/routes/index.ts
var routes = (0, import_express.Router)();
routes.get("/tickets", getAllTickets);
routes.get("/alltickets", getSumOfTicketsClosed);
routes.get("/ticketsweek", getSumOfTicketsClosedThisWeek);
routes.get("/openTickets", getOpenTickets);
routes.get("/closeMon", getClosedTicketsByMonth);
routes.get("/openTicketsThisWeek", getOpenTicketsThisWeek);
routes.get("/createtoday", getTicketsCreatedToday);
routes.get("/ticketsByCategory", getTicketsByCategory);
routes.get("/dailyAverageClosedTickets", getDailyAverageClosedTickets);

// src/server.ts
var app = (0, import_express2.default)();
app.use((0, import_cors.default)());
app.use(import_express2.default.json());
app.use(routes);
app.use(
  (err, request, response, next) => {
    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message
      });
    }
    return response.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
);
app.listen(3333, () => console.log("Server listening on port 3333"));
