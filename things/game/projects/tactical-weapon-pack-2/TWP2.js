var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
var TWP2;
(function (TWP2) {
  var Achievements = /** @class */ (function () {
    function Achievements() {}
    Achievements.Initialize = function () {
      Achievements.db = [
        {
          id: Achievements.ACHIEVEMENT_KILLS_1,
          name: "Kills I",
          desc: "Get 10 kills.",
          medalId: 56615,
        },
        {
          id: Achievements.ACHIEVEMENT_KILLS_2,
          name: "Kills II",
          desc: "Get 100 kills.",
          medalId: 56616,
        },
        {
          id: Achievements.ACHIEVEMENT_KILLS_3,
          name: "Kills III",
          desc: "Get 1,000 kills.",
          medalId: 56617,
        },
        {
          id: Achievements.ACHIEVEMENT_HEADSHOTS_1,
          name: "Headshots I",
          desc: "Get 10 headshots.",
          medalId: 56618,
        },
        {
          id: Achievements.ACHIEVEMENT_HEADSHOTS_2,
          name: "Headshots II",
          desc: "Get 100 headshots.",
          medalId: 56619,
        },
        {
          id: Achievements.ACHIEVEMENT_HEADSHOTS_3,
          name: "Headshots III",
          desc: "Get 1,000 headshots.",
          medalId: 56620,
        },
        {
          id: Achievements.ACHIEVEMENT_EXPERT,
          name: "Expert",
          desc: "Earn " + TWP2.GameModeDatabase.RANKED_STARS + " stars for all game modes.",
          medalId: 56622,
        },
        {
          id: Achievements.ACHIEVEMENT_PRESTIGE,
          name: "Royalty",
          desc: "Prestige your profile.",
          medalId: 56621,
        },
      ];
    };
    Achievements.GetById = function (_id) {
      for (var i = 0; i < Achievements.db.length; i++) {
        if (_id == Achievements.db[i]["id"]) {
          return Achievements.db[i];
        }
      }
      return null;
    };
    Achievements.GetAll = function () {
      return Achievements.db;
    };
    Achievements.ACHIEVEMENT_KILLS_1 = "ACHIEVEMENT_KILLS_1";
    Achievements.ACHIEVEMENT_KILLS_2 = "ACHIEVEMENT_KILLS_2";
    Achievements.ACHIEVEMENT_KILLS_3 = "ACHIEVEMENT_KILLS_3";
    Achievements.ACHIEVEMENT_HEADSHOTS_1 = "ACHIEVEMENT_HEADSHOTS_1";
    Achievements.ACHIEVEMENT_HEADSHOTS_2 = "ACHIEVEMENT_HEADSHOTS_2";
    Achievements.ACHIEVEMENT_HEADSHOTS_3 = "ACHIEVEMENT_HEADSHOTS_3";
    Achievements.ACHIEVEMENT_PRESTIGE = "ACHIEVEMENT_PRESTIGE";
    Achievements.ACHIEVEMENT_EXPERT = "ACHIEVEMENT_EXPERT";
    return Achievements;
  })();
  TWP2.Achievements = Achievements;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var APIUtil = /** @class */ (function () {
    function APIUtil() {}
    APIUtil.Init = function () {
      console.log("Initializing API: " + APIUtil.CurrentAPI);
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.ag) {
          return;
        }
        APIUtil.ag = TWP2.GameUtil.game.ag;
        //APIUtil.ValidateSession(true);
      } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          return;
        }
        APIUtil.ngio = TWP2.GameUtil.game.ngio;
        APIUtil.ngio.debug = TWP2.GameUtil.IsDebugging();
        APIUtil.ValidateSession(false);
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        if (APIUtil.kong) {
          return;
        }
        APIUtil.kong = TWP2.GameUtil.game.kong;
        APIUtil.kong.services.addEventListener("login", APIUtil.OnLoggedIn);
      }
    };
    APIUtil.ValidateSession = function (_bPromptUser) {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.ag) {
          if (!APIUtil.agUser) {
            APIUtil.ag
              .authenticateUser()
              .then(function (user) {
                APIUtil.agUser = user;
                var prevName = APIUtil.CurrentUserName;
                APIUtil.CurrentUserName = user["username"];
                if (prevName != APIUtil.CurrentUserName) {
                  APIUtil.OnLoggedIn();
                }
              })
              .catch(function (error) {
                APIUtil.CurrentUserName = null;
                if (_bPromptUser) {
                  APIUtil.ShowSignInFailedWindow();
                }
              });
          }
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        APIUtil.ngio.getValidSession(function () {
          if (APIUtil.ngio.user) {
            APIUtil.CurrentUserName = APIUtil.ngio.user.name;
          }
          if (_bPromptUser) {
            if (APIUtil.ngio.user) {
              APIUtil.OnLoggedIn();
            } else {
              APIUtil.ShowSignInWindow();
            }
          }
        });
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        if (_bPromptUser) {
          APIUtil.ShowSignInWindow();
        }
      }
    };
    APIUtil.SaveData = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.ag) {
          //...
        }
      }
    };
    APIUtil.LoadData = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.ag) {
          //...
        }
      }
    };
    APIUtil.OnEvent = function (_event) {
      if (_event) {
        switch (_event.name) {
          case "SDK_ERROR":
            TWP2.SoundManager.SetMute(false);
            break;
          case "SDK_GAME_START":
            TWP2.SoundManager.SetMute(false);
            break;
          case "SDK_GAME_PAUSE":
            TWP2.SoundManager.SetMute(true);
            break;
        }
      }
    };
    APIUtil.SubmitScore = function (_gameId, _score) {
      if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          var leaderboardsId = TWP2.GameModeDatabase.GetGameMode(_gameId)["leaderboardsId"];
          APIUtil.ngio.callComponent("ScoreBoard.postScore", { id: leaderboardsId, value: _score }, APIUtil.OnScoreSubmitted);
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        if (APIUtil.kong) {
          console.log("Submit score: " + TWP2.GameModeDatabase.GetGameMode(_gameId)["name"] + " --> " + _score);
          APIUtil.kong.stats.submit(TWP2.GameModeDatabase.GetGameMode(_gameId)["name"], _score);
        }
      }
    };
    APIUtil.OnScoreSubmitted = function (_result) {
      if (_result && _result.success) {
        //
      } else {
        console.log(_result);
        TWP2.GameUtil.game.createWindow({
          titleText: "Submit Score",
          type: TWP2.Window.TYPE_MESSAGE,
          messageText: "Error submitting score!\n\nMake sure you're connected to the internet or try again later.",
        });
        if (APIUtil.CurrentLeaderboards) {
          var sc = APIUtil.CurrentLeaderboards.getSubmitContainer();
          if (sc) {
            sc.visible = false;
          }
        }
      }
    };
    APIUtil.UnlockAchievement = function (_id) {
      var item = TWP2.Achievements.GetById(_id);
      if (!item) {
        return;
      }
      if (APIUtil.IsLoggedIn()) {
        if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
          if (APIUtil.ngio) {
            APIUtil.ngio.callComponent("Medal.unlock", { id: item["medalId"] }, APIUtil.OnMedalUnlocked);
          }
        }
      }
    };
    APIUtil.OnMedalUnlocked = function (_result) {
      console.log("Newgrounds medal unlocked!");
    };
    APIUtil.LoadLeaderboards = function (_gameId, _leaderboards) {
      APIUtil.CurrentLeaderboards = _leaderboards;
      _leaderboards.setLoadingScores();
      if (APIUtil.HasLeaderboards()) {
        if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
          if (APIUtil.ngio) {
            var leaderboardsId = TWP2.GameModeDatabase.GetGameMode(_gameId)["leaderboardsId"];
            APIUtil.ngio.callComponent("ScoreBoard.getScores", { id: leaderboardsId }, APIUtil.OnNewgroundsLeaderboardsLoaded);
          }
        } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
          var statisticId = TWP2.GameModeDatabase.GetGameMode(_gameId)["statisticId"];
          var loader = TWP2.GameUtil.game.load.json("kong_leaderboards", "https://api.kongregate.com/api/high_scores/lifetime/" + statisticId + ".json", true);
          loader.crossOrigin = true;
          loader.start();
          loader.onLoadComplete.add(APIUtil.OnKongLeaderboardsLoaded);
        }
      } else {
        _leaderboards.setUnavailable();
      }
    };
    APIUtil.OnKongLeaderboardsLoaded = function () {
      var json = TWP2.GameUtil.game.cache.getJSON("kong_leaderboards");
      if (json) {
        var scores = json["lifetime_scores"];
        var playerList = [];
        var newItem;
        for (var i = 0; i < scores.length; i++) {
          var item = scores[i];
          newItem = {
            name: item["username"],
            score: item["score"],
            url: "https://www.kongregate.com/accounts/" + item["username"],
          };
          playerList.push(newItem);
        }
        if (APIUtil.CurrentLeaderboards) {
          APIUtil.CurrentLeaderboards.setScores(playerList);
        }
      } else {
        if (APIUtil.CurrentLeaderboards) {
          APIUtil.CurrentLeaderboards.setError();
        }
      }
    };
    APIUtil.OnNewgroundsLeaderboardsLoaded = function (_result) {
      if (_result && _result.success) {
        var scoreboard = _result.scoreboard;
        var scores = _result.scores;
        var playerList = [];
        var newItem;
        for (var i = 0; i < scores.length; i++) {
          var item = scores[i];
          var user = item["user"];
          newItem = {
            name: user.name,
            score: item["value"],
            url: "http://" + user.name + ".newgrounds.com",
          };
          playerList.push(newItem);
        }
        if (APIUtil.CurrentLeaderboards) {
          APIUtil.CurrentLeaderboards.setScores(playerList);
        }
      } else {
        console.log(_result);
        if (APIUtil.CurrentLeaderboards) {
          APIUtil.CurrentLeaderboards.setError();
        }
      }
    };
    APIUtil.ShowSignInWindow = function () {
      if (APIUtil.IsLoggedIn()) {
        return;
      }
      if (TWP2.GameUtil.GetGameState()) {
        return;
      }
      if (TWP2.GameUtil.game.getMainMenu().getCurrentMenu() == TWP2.MainMenu.MENU_PLAY) {
        return;
      }
      TWP2.GameUtil.game.createWindow({
        titleText: "Sign In",
        type: TWP2.Window.TYPE_YES_NO,
        messageText: "Would you like to connect your " + APIUtil.GetCurrentAPIName() + " account?\n\nThis will allow you to submit your score, unlock achievements, and more.",
        highlights: [APIUtil.GetCurrentAPIName()],
        icon: "icon_" + APIUtil.GetCurrentAPIId(),
        yesCallback: APIUtil.RequestLogin,
        yesCallbackContext: APIUtil,
      });
    };
    APIUtil.ShowSignInFailedWindow = function () {
      if (TWP2.GameUtil.GetGameState()) {
        return;
      }
      TWP2.GameUtil.game.createWindow({
        titleText: "Sign In Failed",
        type: TWP2.Window.TYPE_MESSAGE,
        messageText: "There was a problem connecting your " + APIUtil.GetCurrentAPIName() + " account!\n\nMake sure you're connected to the internet or try again later.",
      });
    };
    APIUtil.GetCurrentAPIId = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        return "AG";
      } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        return "NG";
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        return "KONG";
      } else if (APIUtil.CurrentAPI == APIUtil.API_GAME_DISTRIBUTION) {
        return "GD";
      }
      return "N/A";
    };
    APIUtil.GetCurrentAPIName = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        return "Armor Games";
      } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        return "Newgrounds";
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        return "Kongregate";
      } else if (APIUtil.CurrentAPI == APIUtil.API_GAME_DISTRIBUTION) {
        return "Game Distribution";
      }
      return null;
    };
    APIUtil.GetUserName = function () {
      if (APIUtil.CurrentUserName) {
        return APIUtil.CurrentUserName;
      }
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.agUser) {
          return APIUtil.agUser["username"];
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio && APIUtil.ngio.user) {
          return APIUtil.ngio.user.name;
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        if (APIUtil.kong) {
          return APIUtil.kong.services.getUsername();
        }
      }
      if (APIUtil.CurrentAPI) {
        return APIUtil.GetCurrentAPIName() + " Player";
      }
      return "Player";
    };
    APIUtil.HasLeaderboards = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        return false;
      } else if (!APIUtil.CurrentAPI) {
        return false;
      }
      return true;
    };
    APIUtil.CanManuallyLogIn = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        return false;
      }
      return true;
    };
    APIUtil.OnLoggedIn = function () {
      TWP2.PlayerUtil.player["name"] = APIUtil.GetUserName();
      var menu = TWP2.GameUtil.game.getMainMenu();
      if (menu) {
        menu.refreshMenu();
      }
    };
    APIUtil.OnLoggedOut = function () {
      var menu = TWP2.GameUtil.game.getMainMenu();
      if (menu) {
        //...
      }
      APIUtil.ShowSignOutWindow();
    };
    APIUtil.OnLoginFailed = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          APIUtil.ShowSignInFailedWindow();
        }
      }
    };
    APIUtil.OnLoginCancelled = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          APIUtil.ShowSignInFailedWindow();
        }
      }
    };
    APIUtil.Logout = function () {
      APIUtil.CurrentUserName = null;
      if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          APIUtil.ngio.logOut(function () {
            APIUtil.OnLoggedOut();
          });
        }
      }
    };
    APIUtil.ShowSignOutWindow = function () {
      TWP2.GameUtil.game.createWindow({
        titleText: "Signed Out",
        type: TWP2.Window.TYPE_MESSAGE,
        //highlights: [APIUtil.GetCurrentAPIName()],
        messageText: "Your " + APIUtil.GetCurrentAPIName() + " account has been disconnected.\n\nYou can sign in again in the settings menu.",
      });
      var menu = TWP2.GameUtil.game.getMainMenu();
      if (menu) {
        menu.refreshMenu();
      }
    };
    APIUtil.CanSaveData = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        return false;
      }
      return false;
    };
    APIUtil.AdsAreAllowed = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        return true;
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        return false;
      }
      return true;
    };
    APIUtil.RequestLogin = function () {
      if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          APIUtil.ngio.requestLogin(APIUtil.OnLoggedIn, APIUtil.OnLoginFailed, APIUtil.OnLoginCancelled);
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        try {
          if (APIUtil.kong) {
            APIUtil.kong.services.showRegistrationBox();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    APIUtil.ShouldShowSponsor = function () {
      return APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES || TWP2.GameUtil.IsDebugging();
    };
    APIUtil.IsLoggedIn = function () {
      if (!APIUtil.CurrentAPI) {
        return false;
      } else if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.agUser) {
          return true;
        }
      }
      APIUtil.ValidateSession(false);
      if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
        if (APIUtil.ag) {
          if (APIUtil.CurrentUserName != null) {
            return true;
          }
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
        if (APIUtil.ngio) {
          return APIUtil.ngio.user;
        }
      } else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
        if (APIUtil.kong) {
          return !APIUtil.kong.services.isGuest();
        }
      }
      return false;
    };
    APIUtil.API_ARMOR_GAMES = "API_ARMOR_GAMES";
    APIUtil.API_NEWGROUNDS = "API_NEWGROUNDS";
    APIUtil.API_KONGREGATE = "API_KONGREGATE";
    APIUtil.API_GAME_DISTRIBUTION = "API_GAME_DISTRIBUTION";
    APIUtil.CurrentAPI = null;
    APIUtil.CurrentUserName = null;
    APIUtil.CurrentLeaderboards = null;
    APIUtil.GameCount = 0;
    return APIUtil;
  })();
  TWP2.APIUtil = APIUtil;
  var AdUtil = /** @class */ (function () {
    function AdUtil() {}
    AdUtil.OnPauseGame = function () {
      AdUtil.bGameWasMuted = TWP2.SoundManager.IsMuted();
      TWP2.SoundManager.SetMute(true);
      AdUtil.bPaused = true;
    };
    AdUtil.OnResumeGame = function () {
      TWP2.GameUtil.ForceStartAudio();
      AdUtil.SetWasCancelled(false);
      if (!AdUtil.bGameWasMuted) {
        TWP2.SoundManager.SetMute(false);
      }
      AdUtil.bPaused = false;
      var preloader = TWP2.GameUtil.GetPreloaderState();
      if (preloader) {
        if (preloader.isComplete()) {
          preloader.startGame();
        }
      }
    };
    AdUtil.IsPaused = function () {
      return AdUtil.bPaused;
    };
    AdUtil.SetError = function (_bVal) {
      AdUtil.bError = _bVal;
    };
    AdUtil.HasError = function () {
      return AdUtil.bError;
    };
    AdUtil.SetWasCancelled = function (_bVal) {
      AdUtil.bWasCancelled = _bVal;
    };
    AdUtil.WasCancelled = function () {
      return AdUtil.bWasCancelled;
    };
    AdUtil.ViewAd = function () {
      TWP2.GameUtil.game.createWindow({
        titleText: "View Ad",
        messageText: "You can view advertisements for a money bonus.\n\nMake sure ads are enabled!",
        type: TWP2.Window.TYPE_AD,
        bHideCloseButton: true,
      });
    };
    AdUtil.ShowAnchorAd = function () {
      console.log("Attemping to show anchor ad...");
      if (TWP2.GameUtil.AdsEnabled()) {
        if (AdUtil.cpmstarAPI) {
          AdUtil.cpmstarAPI({ kind: "go", module: "anchor" });
        } else {
          console.warn("Invalid AdUtil.cpmstarAPI instance");
        }
      } else {
        console.log("Ads are not enabled");
      }
    };
    AdUtil.ShowPreloaderAd = function () {
      console.log("Attempting to show preloader ad...");
      if (TWP2.GameUtil.AdsEnabled()) {
        if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES || !TWP2.GameUtil.game.ads) {
          if (AdUtil.cpmstarAPI) {
            AdUtil.cpmstarAPI({
              kind: "game.displayInterstitial",
              onAdOpened: function () {
                console.log("onAdOpened");
                AdUtil.OnPauseGame();
              },
              onAdClosed: function () {
                console.log("onAdClosed");
                AdUtil.OnResumeGame();
              },
              fail: function () {
                console.warn("Interstitial ad error!");
                AdUtil.OnResumeGame();
              },
            });
            return true;
          }
        } else {
          var ads = TWP2.GameUtil.game.ads;
          if (ads) {
            console.log("Show ad");
            ads.showAd();
            return true;
          } else {
            console.warn("Invalid GameUtil.game.ads instance");
            return false;
          }
        }
      } else {
        console.log("Ads are not enabled");
        return false;
      }
      return false;
    };
    AdUtil.ShowAd = function () {
      console.log("Attempting to show ad...");
      if (TWP2.GameUtil.AdsEnabled()) {
        if (TWP2.GameUtil.ShouldUseCPMStarAds()) {
          AdUtil.OnPauseGame();
          if (AdUtil.cpmstarAPI) {
            AdUtil.cpmstarAPI({
              kind: "game.displayInterstitial",
              fail: function () {
                console.warn("Interstitial ad error!");
                AdUtil.OnResumeGame();
              },
            });
          }
        } else {
          var ads = TWP2.GameUtil.game.ads;
          if (ads) {
            console.log("Show ad");
            ads.showAd();
          } else {
            console.warn("Invalid GameUtil.game.ads instance");
            return false;
          }
        }
      } else {
        console.log("Ads are not enabled");
        return false;
      }
      return true;
    };
    AdUtil.bPaused = false;
    AdUtil.bGameWasMuted = false;
    AdUtil.bWasCancelled = false;
    AdUtil.bError = false;
    AdUtil.cpmstarAPI = null;
    return AdUtil;
  })();
  TWP2.AdUtil = AdUtil;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var GameModeDatabase = /** @class */ (function () {
    function GameModeDatabase() {}
    GameModeDatabase.Initialize = function () {
      GameModeDatabase.db = [
        {
          id: GameModeDatabase.GAME_SHOOTER,
          name: "Shooter",
          desc: "Destroy the targets before they disappear.",
          scores: [100, 250, 350],
          leaderboardsId: 8465,
          statisticId: 137536,
        },
        {
          id: GameModeDatabase.GAME_TIME_ATTACK,
          name: "Time Attack",
          desc: "Destroy as many targets as you can in 30 seconds.",
          scores: [100, 250, 350],
          leaderboardsId: 8468,
          statisticId: 137537,
        },
        {
          id: GameModeDatabase.GAME_SNIPER,
          name: "Sniper",
          desc: "Long-distance target shooting.",
          scores: [100, 200, 300],
          leaderboardsId: 8466,
          statisticId: 137538,
        },
        {
          id: GameModeDatabase.GAME_HARDENED,
          name: "Hardened",
          desc: "Destroy the buffed metal targets.",
          scores: [100, 150, 200],
          leaderboardsId: 8467,
          statisticId: 137539,
        },
        {
          id: GameModeDatabase.GAME_REFLEX,
          name: "Reflex",
          desc: "Targets disappear after 1 second.",
          scores: [50, 150, 300],
          leaderboardsId: 8504,
          statisticId: 137540,
        },
        {
          id: GameModeDatabase.GAME_DEFENDER,
          name: "Defender",
          desc: "Prevent the targets from reaching the end of the screen.",
          scores: [150, 300, 400],
          leaderboardsId: 8469,
          statisticId: 137541,
        },
        {
          id: GameModeDatabase.GAME_LAVA,
          name: "Lava",
          desc: "Destroy the targets before they reach the floor of lava.",
          scores: [100, 250, 350],
          leaderboardsId: 8470,
          statisticId: 137542,
        },
        {
          id: GameModeDatabase.GAME_WAR,
          name: "War",
          desc: "Survive against the endless waves of robotic soldiers.",
          scores: [100, 250, 350],
          leaderboardsId: 8499,
          statisticId: 137543,
        },
        {
          id: GameModeDatabase.GAME_RANGE,
          name: "Firing Range",
          desc: "Test different weapons in the firing range.",
        },
      ];
    };
    GameModeDatabase.GetAllGameModes = function () {
      return GameModeDatabase.db;
    };
    GameModeDatabase.GetAllRankedGameModes = function () {
      var arr = [];
      for (var i = 0; i < GameModeDatabase.db.length; i++) {
        var cur = GameModeDatabase.db[i];
        if (cur["id"] != GameModeDatabase.GAME_RANGE) {
          arr.push(cur);
        }
      }
      return arr;
    };
    GameModeDatabase.GetGameMode = function (_id) {
      for (var i = 0; i < GameModeDatabase.db.length; i++) {
        if (GameModeDatabase.db[i]["id"] == _id) {
          return GameModeDatabase.db[i];
        }
      }
      return null;
    };
    GameModeDatabase.GetStarsForGameMode = function (_gameModeId, _score) {
      if (_score == 0) {
        return 0;
      }
      var modeData = GameModeDatabase.GetGameMode(_gameModeId);
      if (modeData) {
        var scores = modeData["scores"];
        for (var i = 0; i < scores.length; i++) {
          if (_score <= scores[i]) {
            return i + 1;
          }
        }
      }
      return GameModeDatabase.RANKED_STARS;
    };
    GameModeDatabase.RANKED_STARS = 4;
    GameModeDatabase.GAME_TIME_ATTACK = "game_time_attack";
    GameModeDatabase.GAME_DEFENDER = "game_defender";
    GameModeDatabase.GAME_SNIPER = "game_sniper";
    GameModeDatabase.GAME_SHOOTER = "game_shooter";
    GameModeDatabase.GAME_HARDENED = "game_marksman";
    GameModeDatabase.GAME_REFLEX = "game_reflex";
    GameModeDatabase.GAME_LAVA = "game_lava";
    GameModeDatabase.GAME_WAR = "game_war";
    GameModeDatabase.GAME_RANGE = "game_range";
    return GameModeDatabase;
  })();
  TWP2.GameModeDatabase = GameModeDatabase;
  var SkillDatabase = /** @class */ (function () {
    function SkillDatabase() {}
    SkillDatabase.Initialize = function () {
      SkillDatabase.db = [
        {
          id: SkillDatabase.SKILL_RELOAD,
          name: "Reload",
          desc: "Faster reload speed.",
        },
        {
          id: SkillDatabase.SKILL_AIM,
          name: "Aim",
          desc: "Faster aim speed.",
        },
        {
          id: SkillDatabase.SKILL_RECOIL,
          name: "Recoil",
          desc: "Faster recoil recovery.",
        },
        {
          id: SkillDatabase.SKILL_XP,
          name: "XP",
          desc: "Increased end-game XP rewards.",
        },
        {
          id: SkillDatabase.SKILL_MONEY,
          name: "Money",
          desc: "Increased end-game money rewards.",
        },
      ];
    };
    SkillDatabase.GetAllSkills = function () {
      return SkillDatabase.db;
    };
    SkillDatabase.GetById = function (_id) {
      for (var i = 0; i < SkillDatabase.db.length; i++) {
        if (SkillDatabase.db[i]["id"] == _id) {
          return SkillDatabase.db[i];
        }
      }
      return null;
    };
    SkillDatabase.SKILL_RELOAD = "reload";
    SkillDatabase.SKILL_AIM = "aim";
    SkillDatabase.SKILL_RECOIL = "recoil";
    SkillDatabase.SKILL_XP = "xp";
    SkillDatabase.SKILL_MONEY = "money";
    return SkillDatabase;
  })();
  TWP2.SkillDatabase = SkillDatabase;
  var WeaponDatabase = /** @class */ (function () {
    function WeaponDatabase() {}
    WeaponDatabase.Initialize = function () {
      WeaponDatabase.weapons = [
        {
          id: WeaponDatabase.WEAPON_M9,
          unlockLevel: 1,
          name: "M9",
          desc: "Semi-automatic with good accuracy.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_9MM,
          damage: 15,
          accuracy: 5,
          fireRate: 3,
          magSize: 15,
          reloadTime: 1,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -29,
              y: 6.35,
            },
            slide: {
              x: 1.35,
              y: -23.05,
            },
            muzzle: {
              x: 44,
              y: -25,
            },
            laser: {
              x: 6.25,
              y: -13.15,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_G17,
          unlockLevel: 2,
          name: "G17",
          desc: "Semi-automatic with a high capacity.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_9MM,
          damage: 15,
          accuracy: 3,
          fireRate: 1,
          magSize: 20,
          reloadTime: 1.1,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -28.95,
              y: 9.5,
            },
            slide: {
              x: 4.1,
              y: -26,
            },
            muzzle: {
              x: 47,
              y: -26.7,
            },
            laser: {
              x: 12.65,
              y: -15.7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_P320,
          name: "P320",
          desc: "Semi-automatic with good accuracy and power.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 24,
          accuracy: 3,
          fireRate: 4,
          magSize: 10,
          reloadTime: 1.3,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -27.7,
              y: 7.75,
            },
            slide: {
              x: 3.8,
              y: -26.95,
            },
            muzzle: {
              x: 45,
              y: -26.7,
            },
            laser: {
              x: 8.85,
              y: -13,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_OTS38,
          name: "OTS38",
          desc: "Semi-automatic revolver with moderate power.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_44,
          damage: 60,
          accuracy: 3,
          fireRate: 5,
          magSize: 6,
          reloadTime: 1.4,
          bEjectShell: false,
          bRevolver: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            muzzle: {
              x: 58,
              y: -26,
            },
            laser: {
              x: 19.35,
              y: -13,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_FIVESEVEN,
          name: "Five-SeveN",
          desc: "Semi-automatic with a high capacity and low recoil.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_9MM,
          damage: 19,
          accuracy: 2,
          fireRate: 3,
          magSize: 20,
          reloadTime: 0.9,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -26.7,
              y: 2.8,
            },
            slide: {
              x: 0.7,
              y: -27.95,
            },
            muzzle: {
              x: 44,
              y: -24.25,
            },
            laser: {
              x: 10.5,
              y: -14.25,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_USP45,
          name: "USP .45",
          desc: "Semi-automatic with good accuracy and power.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 27,
          accuracy: 4,
          fireRate: 5,
          magSize: 12,
          reloadTime: 1.2,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -27.25,
              y: 4.1,
            },
            slide: {
              x: 3.1,
              y: -28,
            },
            muzzle: {
              x: 46,
              y: -26.7,
            },
            laser: {
              x: 14.3,
              y: -14.2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M1911,
          name: "M1911",
          desc: "Semi-automatic with high power.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 50,
          accuracy: 1,
          fireRate: 1,
          magSize: 8,
          reloadTime: 1.3,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -30.6,
              y: 5.25,
            },
            slide: {
              x: 5.1,
              y: -28.1,
            },
            muzzle: {
              x: 52,
              y: -27.4,
            },
            laser: {
              x: 5.3,
              y: -16.25,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MAXIM9,
          name: "Maxim 9",
          desc: "Semi-automatic with integral silencer.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_9MM,
          damage: 23,
          accuracy: 1,
          fireRate: 5,
          magSize: 15,
          reloadTime: 1.1,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -39.25,
              y: 11.6,
            },
            slide: {
              x: -26.5,
              y: -21,
            },
            muzzle: {
              x: 51.35,
              y: -18,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_DEAGLE,
          name: "Desert Eagle",
          desc: "Semi-automatic with very high power.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_50CAL,
          damage: 100,
          accuracy: 4,
          fireRate: 12,
          magSize: 7,
          reloadTime: 2.0,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -32.95,
              y: 12.85,
            },
            slide: {
              x: -1.35,
              y: -23.2,
            },
            muzzle: {
              bBack: true,
              x: 57,
              y: -23.25,
            },
            laser: {
              bBack: true,
              x: 9,
              y: -12,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MAGNUM,
          name: ".44 Magnum",
          desc: "Semi-automatic revolver with high power and good accuracy.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_44,
          damage: 80,
          accuracy: 2,
          fireRate: 4,
          magSize: 6,
          reloadTime: 1.5,
          bEjectShell: false,
          bRevolver: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            muzzle: {
              x: 65,
              y: -23.85,
            },
            laser: {
              x: 6.3,
              y: -15,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_RHINO,
          name: "Rhino",
          desc: "Semi-automatic revolver with extremely high power.",
          type: WeaponDatabase.TYPE_PISTOL,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_357,
          damage: 150,
          accuracy: 3,
          fireRate: 10,
          magSize: 6,
          reloadTime: 2.1,
          bEjectShell: false,
          bRevolver: true,
          bPrestige: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            muzzle: {
              bBack: true,
              x: 73,
              y: -24.15,
            },
            laser: {
              x: 38.3,
              y: -9,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M93R,
          name: "M93R",
          desc: "Semi-automatic with 3 round burst fire.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_BURST,
          round: WeaponDatabase.ROUND_9MM,
          damage: 18,
          accuracy: 4,
          fireRate: 2,
          burstFireRate: 15,
          magSize: 15,
          reloadTime: 1.3,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -34.6,
              y: 13.25,
            },
            slide: {
              x: -3.15,
              y: -23.3,
            },
            muzzle: {
              x: 50.15,
              y: -24,
            },
            laser: {
              x: 2,
              y: -15,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_G18,
          name: "G18",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 16,
          accuracy: 5,
          fireRate: 3,
          magSize: 20,
          reloadTime: 1.4,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -33.7,
              y: 31.5,
            },
            slide: {
              x: 4.1,
              y: -25.65,
            },
            muzzle: {
              x: 47,
              y: -26.7,
            },
            laser: {
              x: 17,
              y: -14,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MPA57,
          name: "MPA57",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 20,
          accuracy: 3,
          fireRate: 2,
          magSize: 20,
          reloadTime: 1.5,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -11,
              y: 14.05,
            },
            muzzle: {
              x: 70,
              y: -20,
            },
            laser: {
              x: 24.3,
              y: -9,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SKORPION,
          name: "Skorpion",
          desc: "Fully automatic with low recoil.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 20,
          accuracy: 2,
          fireRate: 6,
          magSize: 20,
          reloadTime: 1.25,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: 6.35,
              y: 11.1,
            },
            muzzle: {
              x: 63,
              y: -22.75,
            },
            laser: {
              x: 2,
              y: -14.2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_USPM,
          name: "USP Match",
          desc: "Fully automatic with high accuracy.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 25,
          accuracy: 1,
          fireRate: 6,
          magSize: 12,
          reloadTime: 1.5,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -35.5,
              y: 15.35,
            },
            slide: {
              x: -4.4,
              y: -28.9,
            },
            muzzle: {
              x: 50.8,
              y: -25,
            },
            laser: {
              x: 8.3,
              y: -12,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_KARD,
          name: "KARD",
          desc: "Fully automatic with good accuracy.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 23,
          accuracy: 2,
          fireRate: 4,
          magSize: 15,
          reloadTime: 1.6,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -39,
              y: 27.7,
            },
            muzzle: {
              x: 54,
              y: -21.4,
            },
            laser: {
              x: 15.4,
              y: -1,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_FMG9,
          name: "FMG9",
          desc: "Fully automatic with a high capacity.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 17,
          accuracy: 4,
          fireRate: 3,
          magSize: 30,
          reloadTime: 1.6,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: 8.1,
              y: 34.1,
            },
            muzzle: {
              x: 111.75,
              y: -14.25,
            },
            laser: {
              x: 85.45,
              y: 2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MP1911,
          name: "MP-1911",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 35,
          accuracy: 3,
          fireRate: 5,
          magSize: 20,
          reloadTime: 1.7,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -48.05,
              y: 30.5,
            },
            slide: {
              x: -4.4,
              y: -28.1,
            },
            muzzle: {
              x: 61.4,
              y: -26.5,
            },
            laser: {
              x: -4.1,
              y: -14.7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MP9,
          name: "MP9",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 18,
          accuracy: 2,
          fireRate: 3,
          magSize: 32,
          reloadTime: 1.9,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -17,
              y: 33.9,
            },
            muzzle: {
              x: 61,
              y: -16,
            },
            laser: {
              x: 30,
              y: -9.2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_VP70,
          name: "VP70",
          desc: "Semi-automatic with 3 round burst fire.",
          type: WeaponDatabase.TYPE_MACHINE_PISTOL,
          fireMode: WeaponDatabase.MODE_BURST,
          round: WeaponDatabase.ROUND_9MM,
          damage: 25,
          accuracy: 2,
          fireRate: 2,
          burstFireRate: 15,
          magSize: 15,
          reloadTime: 1.5,
          bPrestige: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: 47.05,
              y: 7.85,
            },
            slide: {
              x: 78,
              y: -27,
            },
            muzzle: {
              x: 121.6,
              y: -27.6,
            },
            laser: {
              x: 92.25,
              y: -21.45,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MP5,
          unlockLevel: 1,
          name: "MP5",
          desc: "Fully automatic with good accuracy.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 16,
          accuracy: 2,
          fireRate: 5,
          magSize: 30,
          reloadTime: 1.2,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 3.05,
              y: -25.75,
            },
            mag: {
              x: 33.95,
              y: 27.15,
            },
            laser: {
              x: 64,
              y: -8.2,
            },
            muzzle: {
              x: 111,
              y: -14,
            },
            grip: {
              x: 57,
              y: -6,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AUGPARA,
          name: "AUG-PARA",
          desc: "Fully automatic with low recoil.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 15,
          accuracy: 4,
          fireRate: 3,
          magSize: 25,
          reloadTime: 1.35,
          bNoGrip: true,
          bSmallLaser: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 34.4,
              y: -20.2,
            },
            mag: {
              x: -37.65,
              y: 21.85,
            },
            laser: {
              bBack: true,
              x: 78,
              y: -17,
            },
            muzzle: {
              x: 112.95,
              y: -22.25,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_UMP45,
          name: "UMP-45",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 28,
          accuracy: 2,
          fireRate: 6,
          magSize: 25,
          reloadTime: 1.5,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 16.7,
              y: -28.95,
            },
            mag: {
              x: 56.8,
              y: 37.15,
            },
            laser: {
              x: 72,
              y: -32,
            },
            muzzle: {
              x: 118.85,
              y: -12.95,
            },
            grip: {
              x: 76,
              y: -6,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_VSK,
          name: "9A-91",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 25,
          accuracy: 6,
          fireRate: 4,
          magSize: 20,
          reloadTime: 1.8,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 10.5,
              y: -32.3,
            },
            mag: {
              x: 37.45,
              y: 6.9,
            },
            laser: {
              bBack: true,
              x: 76.35,
              y: -18.2,
            },
            muzzle: {
              x: 120,
              y: -23,
            },
            grip: {
              bBack: true,
              x: 68,
              y: -12,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_VECTOR,
          name: "Vector",
          desc: "Fully automatic with low recoil.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 20,
          accuracy: 3,
          fireRate: 3,
          magSize: 25,
          reloadTime: 1.6,
          bSmallLaser: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 16.75,
              y: -25.95,
            },
            mag: {
              x: 43.45,
              y: 44.35,
            },
            laser: {
              x: 81,
              y: 6,
            },
            muzzle: {
              x: 120,
              y: -5.7,
            },
            grip: {
              x: 82,
              y: 7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MP7,
          name: "MP7",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 18,
          accuracy: 4,
          fireRate: 3,
          magSize: 40,
          reloadTime: 1.5,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 25.5,
              y: -25,
            },
            mag: {
              x: 30.55,
              y: 35.15,
            },
            laser: {
              x: 62,
              y: -21,
            },
            muzzle: {
              x: 122,
              y: -6.25,
            },
            grip: {
              x: 72,
              y: 0,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_ARP,
          name: "ARP-556",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 25,
          accuracy: 4,
          fireRate: 4,
          magSize: 30,
          reloadTime: 1.6,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 33.25,
              y: -27,
            },
            mag: {
              x: 44.9,
              y: 20.9,
            },
            laser: {
              x: 72,
              y: -9,
            },
            grip: {
              x: 76,
              y: -9,
            },
            muzzle: {
              x: 117,
              y: -18.5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MAC10,
          name: "MAC-10",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 28,
          accuracy: 5,
          fireRate: 4,
          magSize: 20,
          reloadTime: 1.3,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -24.9,
              y: -30,
            },
            mag: {
              x: -16.1,
              y: 34.25,
            },
            laser: {
              x: 24,
              y: -6,
            },
            muzzle: {
              x: 69.65,
              y: -19.5,
            },
            grip: {
              x: 28,
              y: -6,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_P90,
          name: "P90",
          desc: "Fully automatic with a high capacity and low recoil.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 15,
          accuracy: 3,
          fireRate: 2,
          magSize: 50,
          reloadTime: 1.8,
          bNoGrip: true,
          bSmallLaser: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              bBack: true,
              x: 52.6,
              y: -30,
            },
            mag: {
              x: 17,
              y: -13.95,
            },
            laser: {
              x: 60,
              y: -2,
            },
            muzzle: {
              x: 104,
              y: -4,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AK74U,
          name: "AKS-74u",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 32,
          accuracy: 5,
          fireRate: 6,
          magSize: 30,
          reloadTime: 1.5,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -5.4,
              y: -29.25,
            },
            mag: {
              x: 32.6,
              y: 29.1,
            },
            laser: {
              bBack: true,
              x: 91,
              y: -10.25,
            },
            muzzle: {
              x: 135,
              y: -14,
            },
            grip: {
              bBack: true,
              x: 72,
              y: -7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_PDR,
          name: "PDR",
          desc: "Fully automatic with high rate of fire.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 17,
          accuracy: 2,
          fireRate: 2,
          magSize: 30,
          reloadTime: 1.6,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 39.5,
              y: -36.55,
            },
            mag: {
              x: -51.95,
              y: 7.4,
            },
            laser: {
              x: 62,
              y: -3,
            },
            muzzle: {
              x: 100,
              y: -21.3,
            },
            grip: {
              x: 64,
              y: -1,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_HK416C,
          name: "HK416C",
          desc: "Fully automatic with good accuracy.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 22,
          accuracy: 2,
          fireRate: 5,
          magSize: 30,
          reloadTime: 1.7,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 0,
              y: -27.75,
            },
            mag: {
              x: 24,
              y: 19.15,
            },
            laser: {
              x: 68,
              y: -34,
            },
            grip: {
              x: 60,
              y: -7,
            },
            muzzle: {
              x: 137,
              y: -17,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_PSG,
          name: "PSG",
          desc: "Fully automatic with good accuracy and low recoil.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 19,
          accuracy: 1,
          fireRate: 4,
          magSize: 30,
          reloadTime: 1.8,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 1.4,
              y: -29.95,
            },
            mag: {
              x: 20.2,
              y: 16.75,
            },
            laser: {
              x: 71.6,
              y: -32.95,
            },
            muzzle: {
              x: 132.75,
              y: -17.8,
            },
            grip: {
              x: 61,
              y: -11,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_EVO3,
          name: "Scorpion EVO 3",
          desc: "Fully automatic with high accuracy.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_9MM,
          damage: 23,
          accuracy: 0,
          fireRate: 3,
          magSize: 20,
          reloadTime: 1.5,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 9.45,
              y: -33.4,
            },
            mag: {
              x: 34,
              y: 16.85,
            },
            laser: {
              x: 81,
              y: -7,
            },
            grip: {
              x: 72,
              y: -6,
            },
            muzzle: {
              x: 118,
              y: -15.75,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_HONEYBADGER,
          name: "Honey Badger",
          desc: "Fully automatic with fast reload time and low recoil.",
          type: WeaponDatabase.TYPE_SMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_45ACP,
          damage: 20,
          accuracy: 2,
          fireRate: 5,
          magSize: 20,
          reloadTime: 1.1,
          bSmallLaser: true,
          bLowRecoil: true,
          bPrestige: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -14.5,
              y: -30.15,
            },
            mag: {
              x: 7.5,
              y: 24.7,
            },
            laser: {
              x: 62,
              y: -9,
            },
            muzzle: {
              x: 168.2,
              y: -19,
            },
            grip: {
              x: 55,
              y: -10,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M16A4,
          unlockLevel: 1,
          name: "M16A4",
          desc: "Semi-automatic with 3 round burst fire.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_BURST,
          round: WeaponDatabase.ROUND_556MM,
          damage: 31,
          accuracy: 3,
          fireRate: 4,
          burstFireRate: 20,
          magSize: 30,
          reloadTime: 1.7,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -39.25,
              y: -27,
            },
            mag: {
              x: -17.4,
              y: 23.15,
            },
            laser: {
              x: 86,
              y: -32,
            },
            m203: {
              x: 8,
              y: -7,
            },
            muzzle: {
              x: 192,
              y: -15.5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M4,
          unlockLevel: 3,
          name: "M4A1",
          desc: "Fully automatic with low recoil.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 22,
          accuracy: 4,
          fireRate: 5,
          magSize: 30,
          reloadTime: 1.8,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -24.3,
              y: -27,
            },
            mag: {
              x: -2.35,
              y: 23.15,
            },
            laser: {
              x: 54,
              y: -32,
            },
            m203: {
              x: 22,
              y: -7,
            },
            muzzle: {
              x: 167,
              y: -15,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_TAVOR,
          name: "Tavor X95",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 22,
          accuracy: 3,
          fireRate: 3,
          magSize: 25,
          reloadTime: 2.4,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -27.2,
              y: -31.85,
            },
            mag: {
              x: -59,
              y: 26.05,
            },
            laser: {
              x: 60,
              y: -26,
            },
            m203: {
              x: 30,
              y: -1,
            },
            muzzle: {
              x: 138,
              y: -9,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_G36C,
          name: "G36C",
          desc: "Fully automatic with low recoil.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 25,
          accuracy: 3,
          fireRate: 6,
          magSize: 30,
          reloadTime: 1.9,
          bSmallM203: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 7,
              y: -32,
            },
            mag: {
              x: 24.25,
              y: 25.8,
            },
            laser: {
              x: 68,
              y: -26,
            },
            m203: {
              x: 40,
              y: -2,
            },
            muzzle: {
              x: 128.4,
              y: -10.7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_LE6940,
          name: "LE6940",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 23,
          accuracy: 2,
          fireRate: 4,
          magSize: 30,
          reloadTime: 2.0,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -2.5,
              y: -29,
            },
            mag: {
              x: 20,
              y: 18.15,
            },
            laser: {
              x: 64,
              y: -36,
            },
            m203: {
              x: 30,
              y: -10,
            },
            muzzle: {
              x: 144,
              y: -18.25,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_TYPE95,
          name: "Type 95",
          desc: "Semi-automatic with 3 round burst fire.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_BURST,
          round: WeaponDatabase.ROUND_556MM,
          damage: 34,
          accuracy: 6,
          fireRate: 3,
          burstFireRate: 18,
          magSize: 30,
          reloadTime: 1.7,
          bSmallM203: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              bBack: true,
              x: 1.5,
              y: -36.7,
            },
            mag: {
              x: -54.5,
              y: 25.5,
            },
            laser: {
              x: 78,
              y: -5,
            },
            m203: {
              x: 48,
              y: 0,
            },
            muzzle: {
              x: 134,
              y: -6.5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SCARL,
          name: "SCAR-L",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 33,
          accuracy: 4,
          fireRate: 7,
          magSize: 30,
          reloadTime: 2.2,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -9.35,
              y: -28.5,
            },
            mag: {
              x: 21.5,
              y: 27.8,
            },
            laser: {
              x: 72,
              y: -30,
            },
            m203: {
              x: 39,
              y: -5,
            },
            muzzle: {
              x: 150,
              y: -11.7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_HK416,
          name: "HK416",
          desc: "Fully automatic with high accuracy.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 25,
          accuracy: 1,
          fireRate: 7,
          magSize: 30,
          reloadTime: 1.9,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -6.5,
              y: -27.75,
            },
            mag: {
              x: 14,
              y: 19.15,
            },
            laser: {
              x: 60,
              y: -34,
            },
            m203: {
              x: 28,
              y: -8,
            },
            muzzle: {
              x: 157,
              y: -17,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AUG,
          name: "AUG",
          desc: "Fully automatic with a good balance of accuracy and damage.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 28,
          accuracy: 2,
          fireRate: 5,
          magSize: 30,
          reloadTime: 1.8,
          bSmallM203: true,
          bSmallLaser: true,
          bNoGrip: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 15.4,
              y: -20.2,
            },
            mag: {
              x: -56.65,
              y: 21.85,
            },
            laser: {
              bBack: true,
              x: 55,
              y: -18,
            },
            m203: {
              x: 64,
              y: -21,
            },
            muzzle: {
              x: 140,
              y: -22.25,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AK47,
          name: "AK47",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 36,
          accuracy: 4,
          fireRate: 7,
          magSize: 30,
          reloadTime: 2,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -28.25,
              y: -30.4,
            },
            mag: {
              x: 5.35,
              y: 27.1,
            },
            laser: {
              x: 72,
              y: -32,
            },
            m203: {
              x: 40,
              y: -10,
            },
            muzzle: {
              x: 162,
              y: -15.5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_GALIL,
          name: "Galil",
          desc: "Fully automatic with high accuracy.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 25,
          accuracy: 1,
          fireRate: 5,
          magSize: 35,
          reloadTime: 1.8,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 0.75,
              y: -32.3,
            },
            mag: {
              x: 30.5,
              y: 20.65,
            },
            laser: {
              x: 52,
              y: -34,
            },
            m203: {
              x: 50,
              y: -7,
            },
            muzzle: {
              x: 130,
              y: -16,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_GALIL52,
          name: "Galil ACE",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 35,
          accuracy: 2,
          fireRate: 8,
          magSize: 20,
          reloadTime: 2.5,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 12,
              y: -32.3,
            },
            mag: {
              x: 1.25,
              y: 24,
            },
            laser: {
              x: 52,
              y: -34,
            },
            m203: {
              x: 20,
              y: -8,
            },
            muzzle: {
              x: 161,
              y: -16.5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_FAMAS,
          name: "FAMAS",
          desc: "Semi-automatic with 3 round burst fire.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_BURST,
          round: WeaponDatabase.ROUND_556MM,
          damage: 33,
          accuracy: 2,
          fireRate: 3,
          burstFireRate: 15,
          magSize: 30,
          reloadTime: 1.9,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 54.25,
              y: -40.5,
            },
            mag: {
              x: -58.5,
              y: 30.95,
            },
            laser: {
              x: 80,
              y: -28,
            },
            m203: {
              x: 50,
              y: -6,
            },
            muzzle: {
              x: 146,
              y: -7.35,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_TAR21,
          name: "MTAR-21",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 32,
          accuracy: 3,
          fireRate: 4,
          magSize: 30,
          reloadTime: 2.0,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 21,
              y: -36.5,
            },
            mag: {
              x: -47,
              y: 23,
            },
            laser: {
              x: 72,
              y: -28,
            },
            m203: {
              x: 58,
              y: -2,
            },
            muzzle: {
              x: 124,
              y: -17,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_FG42,
          name: "FG42",
          desc: "German World War 2 assault rifle with high power.",
          type: WeaponDatabase.TYPE_RIFLE,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          bPrestige: true,
          damage: 48,
          accuracy: 2,
          fireRate: 4,
          magSize: 20,
          reloadTime: 2.4,
          bSmallGrip: true,
          bSmallLaser: true,
          bSmallM203: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -41.65,
              y: -20,
            },
            mag: {
              x: 18,
              y: -5,
            },
            laser: {
              x: 138,
              y: 0,
            },
            m203: {
              x: 60,
              y: -5,
            },
            muzzle: {
              x: 183,
              y: -10.1,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M40A3,
          unlockLevel: 1,
          name: "M40A3",
          desc: "Bolt-action sniper rifle.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          bSingleRoundLoaded: true,
          damage: 100,
          accuracy: 1,
          fireRate: 45,
          magSize: 5,
          reloadTime: 0.5,
          bBoltAction: true,
          bNoGrip: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -34.55,
              y: -30,
            },
            laser: {
              x: 92,
              y: -17,
            },
            muzzle: {
              x: 213,
              y: -19.5,
            },
            bipod: {
              x: 60,
              y: -3,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_RSASS,
          name: "RSASS",
          desc: "Semi-automatic sniper rifle.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 60,
          accuracy: 2,
          fireRate: 12,
          magSize: 10,
          reloadTime: 2.8,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -15.2,
              y: -35.5,
            },
            mag: {
              x: -20.25,
              y: 15.75,
            },
            laser: {
              x: 50,
              y: -42,
            },
            m203: {
              x: 18,
              y: -17,
            },
            muzzle: {
              x: 190,
              y: -23.5,
            },
            bipod: {
              x: 84,
              y: -18,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SAMR,
          name: "SAM-R",
          desc: "Semi-automatic sniper rifle with a high capacity.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_556MM,
          damage: 38,
          accuracy: 2,
          fireRate: 6,
          magSize: 30,
          reloadTime: 3,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -15.2,
              y: -34,
            },
            mag: {
              x: -26,
              y: 8,
            },
            laser: {
              x: 72,
              y: -38,
            },
            m203: {
              x: 9,
              y: -14,
            },
            muzzle: {
              x: 185,
              y: -22.8,
            },
            bipod: {
              x: 96,
              y: -14,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_HTI,
          name: "HTI",
          desc: "Bullpup semi-automatic sniper rifle.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 100,
          accuracy: 1,
          fireRate: 10,
          magSize: 5,
          reloadTime: 2.9,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 0,
              y: -28.3,
            },
            mag: {
              x: -107,
              y: 8.45,
            },
            laser: {
              x: 50,
              y: -34,
            },
            m203: {
              x: 20,
              y: -9,
            },
            muzzle: {
              x: 180,
              y: -17.5,
            },
            bipod: {
              x: 85,
              y: -9,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MB13,
          name: "MB13",
          desc: "Bolt-action sniper rifle with fast reload time.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          bSingleRoundLoaded: true,
          damage: 110,
          accuracy: 1,
          fireRate: 40,
          magSize: 4,
          reloadTime: 0.3,
          bBoltAction: true,
          bNoGrip: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -22.5,
              y: -31,
            },
            laser: {
              x: 69,
              y: -22,
            },
            muzzle: {
              x: 190,
              y: -24.7,
            },
            bipod: {
              x: 54,
              y: -11,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SR25,
          name: "SR-25",
          desc: "Semi-automatic sniper rifle with good power and low recoil.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 70,
          accuracy: 1,
          fireRate: 12,
          magSize: 10,
          reloadTime: 2.8,
          bAllowUnderbarrel: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 10.6,
              y: -38.2,
            },
            mag: {
              x: -16,
              y: 8,
            },
            laser: {
              x: 90,
              y: -42,
            },
            m203: {
              x: 22,
              y: -17,
            },
            muzzle: {
              x: 200,
              y: -24.5,
            },
            bipod: {
              x: 92,
              y: -17,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_HK417,
          name: "HK417",
          desc: "Semi-automatic sniper rifle with moderate power.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 60,
          accuracy: 2,
          fireRate: 4,
          magSize: 10,
          reloadTime: 2.6,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 32.5,
              y: -34.5,
            },
            mag: {
              x: 6.75,
              y: 14.75,
            },
            laser: {
              x: 62,
              y: -38,
            },
            m203: {
              x: 30,
              y: -12,
            },
            muzzle: {
              x: 165,
              y: -22.8,
            },
            bipod: {
              x: 80,
              y: -12,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MSR,
          name: "MSR",
          desc: "Bolt-action sniper rifle with high power.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 150,
          accuracy: 0,
          fireRate: 40,
          magSize: 10,
          reloadTime: 3.2,
          bBoltAction: true,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 11,
              y: -32,
            },
            mag: {
              x: -32.8,
              y: 2.4,
            },
            laser: {
              x: 76,
              y: -38,
            },
            m203: {
              x: 44,
              y: -10,
            },
            muzzle: {
              x: 197,
              y: -21.75,
            },
            bipod: {
              x: 104,
              y: -10,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SRS,
          name: "SRS A1",
          desc: "Bullpup semi-automatic sniper rifle with high accuracy.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_556MM,
          damage: 55,
          accuracy: 0,
          fireRate: 4,
          magSize: 15,
          reloadTime: 2.0,
          bAllowUnderbarrel: true,
          bSmallM203: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 38.85,
              y: -30.25,
            },
            mag: {
              x: -57,
              y: 4.4,
            },
            laser: {
              x: 70,
              y: -40,
            },
            m203: {
              x: 58,
              y: -14,
            },
            muzzle: {
              x: 137,
              y: -21.7,
            },
            bipod: {
              x: 51,
              y: -14,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_TPR,
          name: "TPR",
          desc: "Fully automatic sniper rifle.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 60,
          accuracy: 3,
          fireRate: 9,
          magSize: 20,
          reloadTime: 2.8,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -3.7,
              y: -29.05,
            },
            mag: {
              x: -12.7,
              y: 33.3,
            },
            laser: {
              x: 84,
              y: -31,
            },
            m203: {
              x: 22,
              y: -4,
            },
            muzzle: {
              x: 190.6,
              y: -12.45,
            },
            bipod: {
              x: 70,
              y: -4,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_L115A3,
          name: "L115A3",
          desc: "Bolt-action sniper rifle with high power.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 180,
          accuracy: 0,
          fireRate: 50,
          magSize: 5,
          reloadTime: 2.8,
          bBoltAction: true,
          bNoGrip: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -39.25,
              y: -31,
            },
            mag: {
              x: -46.55,
              y: 4.25,
            },
            laser: {
              bBack: true,
              x: 76,
              y: -21,
            },
            muzzle: {
              x: 221.15,
              y: -24,
            },
            bipod: {
              bBack: true,
              x: 40,
              y: -8,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_BFG,
          name: "BFG-50",
          desc: "Extremely powerful semi-automatic sniper rifle.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_50BMG,
          damage: 250,
          accuracy: 1,
          fireRate: 35,
          magSize: 5,
          reloadTime: 3.2,
          bNoGrip: true,
          bShellCasing: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -59,
              y: -41.85,
            },
            mag: {
              x: -75,
              y: 21.2,
            },
            laser: {
              x: 72,
              y: -38,
            },
            muzzle: {
              x: 252,
              y: -17,
            },
            bipod: {
              x: 92,
              y: -6,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AUG5G,
          name: "AUG AU-5G",
          desc: "Semi-automatic sniper rifle with high power.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 100,
          accuracy: 2,
          fireRate: 10,
          magSize: 15,
          reloadTime: 2.6,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -8.6,
              y: -16.2,
            },
            mag: {
              x: -96,
              y: 19,
            },
            laser: {
              x: 40,
              y: -33,
            },
            grip: {
              x: 34,
              y: -9,
            },
            muzzle: {
              bBack: true,
              x: 170,
              y: -20,
            },
            bipod: {
              x: 44,
              y: -7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M82A1,
          name: "M82A1 Barrett",
          desc: "Extremely powerful anti-material sniper rifle.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_50BMG,
          damage: 300,
          accuracy: 0,
          fireRate: 55,
          magSize: 5,
          reloadTime: 3.5,
          unlockLevel: 50,
          bNoGrip: true,
          bShellCasing: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -60,
              y: -36,
            },
            mag: {
              x: -65,
              y: 17.5,
            },
            laser: {
              x: 70,
              y: -40,
            },
            muzzle: {
              x: 280,
              y: -24,
            },
            bipod: {
              x: 72,
              y: -13,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_PSG1,
          name: "MSG90",
          desc: "Semi-automatic sniper rifle with a high capacity.",
          type: WeaponDatabase.TYPE_SNIPER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_762MM,
          damage: 75,
          accuracy: 1,
          fireRate: 8,
          magSize: 20,
          reloadTime: 2.5,
          bSmallLaser: true,
          bPrestige: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -16,
              y: -37.2,
            },
            mag: {
              x: -26.2,
              y: 8.75,
            },
            laser: {
              bBack: true,
              x: 94,
              y: -18,
            },
            muzzle: {
              x: 207.25,
              y: -22.2,
            },
            grip: {
              bBack: true,
              x: 37,
              y: -14,
            },
            bipod: {
              bBack: true,
              x: 84,
              y: -15,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MOSSBERG,
          unlockLevel: 1,
          name: "Mossberg 500",
          desc: "Pump-action combat shotgun.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          bSingleRoundLoaded: true,
          damage: 20,
          accuracy: 10,
          fireRate: 35,
          magSize: 6,
          reloadTime: 0.5,
          bEjectShell: false,
          bPump: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 13.65,
              y: -36.75,
            },
            pump: {
              x: 95.95,
              y: -19,
            },
            laser: {
              bBack: true,
              x: 125,
              y: -17,
            },
            muzzle: {
              x: 169.85,
              y: -30.9,
            },
            grip: {
              bBack: true,
              x: 20,
              y: 18,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M1014,
          name: "M1014",
          desc: "Semi-automatic combat shotgun with good accuracy.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          bSingleRoundLoaded: true,
          damage: 19,
          accuracy: 9,
          fireRate: 10,
          magSize: 7,
          reloadTime: 0.4,
          unlockLevel: 8,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -12.2,
              y: -31.5,
            },
            laser: {
              x: 78,
              y: -34,
            },
            muzzle: {
              x: 181.1,
              y: -23.5,
            },
            grip: {
              x: 44,
              y: -5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SPAS12,
          name: "SPAS-12",
          desc: "Fully automatic combat shotgun.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_12G,
          bSingleRoundLoaded: true,
          damage: 23,
          accuracy: 13,
          fireRate: 10,
          magSize: 8,
          reloadTime: 0.6,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              bBack: true,
              x: -39,
              y: -24,
            },
            laser: {
              x: 60,
              y: -32,
            },
            muzzle: {
              x: 123.6,
              y: -18.5,
            },
            grip: {
              x: 35,
              y: 0,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SHORTY,
          name: "Super Shorty",
          desc: "Compact shotgun with high power.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          damage: 34,
          accuracy: 14,
          fireRate: 10,
          magSize: 4,
          reloadTime: 0.6,
          bSingleRoundLoaded: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -12.1,
              y: -36,
            },
            laser: {
              x: 50,
              y: -34,
            },
            muzzle: {
              x: 102,
              y: -28.5,
            },
            grip: {
              x: 52,
              y: -13,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SAIGA,
          name: "Saiga-12K",
          desc: "Fully automatic combat shotgun with a high capacity.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_12G,
          damage: 16,
          accuracy: 13,
          fireRate: 11,
          magSize: 15,
          reloadTime: 3.1,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -27.5,
              y: -33.7,
            },
            mag: {
              x: 13,
              y: 23.4,
            },
            laser: {
              x: 70,
              y: -34,
            },
            muzzle: {
              x: 176.25,
              y: -17.2,
            },
            grip: {
              x: 65.3,
              y: -10,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M3,
          name: "Benelli M3",
          desc: "Pump-action combat shotgun with high power.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          bSingleRoundLoaded: true,
          damage: 28,
          accuracy: 11,
          fireRate: 40,
          magSize: 8,
          reloadTime: 0.4,
          bEjectShell: false,
          bPump: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -6.35,
              y: -34,
            },
            pump: {
              x: 97,
              y: -12,
            },
            laser: {
              x: 100,
              y: -38,
            },
            muzzle: {
              x: 168,
              y: -27,
            },
            grip: {
              x: 16,
              y: 18,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_KSG,
          name: "KSG",
          desc: "Semi-automatic combat shotgun with low recoil.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          bSingleRoundLoaded: true,
          damage: 20,
          accuracy: 11,
          fireRate: 8,
          magSize: 10,
          reloadTime: 0.5,
          bSmallLaser: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 53.5,
              y: -35.25,
            },
            laser: {
              x: 84,
              y: -4,
            },
            muzzle: {
              x: 134,
              y: -24,
            },
            grip: {
              x: 82,
              y: -4,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AA12,
          name: "AA-12",
          desc: "Fully automatic combat shotgun with a high rate of fire.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_12G,
          damage: 20,
          accuracy: 14,
          fireRate: 7,
          magSize: 8,
          reloadTime: 3.1,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -26,
              y: -35.35,
            },
            mag: {
              x: -2.9,
              y: 26.85,
            },
            laser: {
              x: 50,
              y: -38,
            },
            muzzle: {
              x: 153.75,
              y: -16.2,
            },
            grip: {
              x: 50,
              y: -10,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_R870,
          name: "R870 Magpul",
          desc: "Pump-action combat shotgun with high accuracy.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          damage: 22,
          accuracy: 7,
          fireRate: 30,
          magSize: 6,
          reloadTime: 2.7,
          bEjectShell: false,
          bPump: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -23.75,
              y: -37.45,
            },
            mag: {
              x: -11.7,
              y: 19.7,
            },
            pump: {
              x: 84,
              y: -15.5,
            },
            laser: {
              bBack: true,
              x: 113,
              y: -25,
            },
            muzzle: {
              x: 197,
              y: -28.1,
            },
            grip: {
              bBack: true,
              x: 0,
              y: 14,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_DB,
          name: "Stoeger",
          desc: "Double-barreled shotgun with high power.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          damage: 46,
          accuracy: 10,
          fireRate: 12,
          magSize: 2,
          reloadTime: 1.3,
          bEjectShell: false,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 11.5,
              y: -36,
            },
            laser: {
              x: 84,
              y: -28.55,
            },
            muzzle: {
              x: 161.5,
              y: -30.5,
            },
            grip: {
              bBack: true,
              x: 40,
              y: -21,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M1216,
          name: "M1216",
          desc: "Semi-automatic combat shotgun with a high capacity.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          damage: 17,
          accuracy: 9,
          fireRate: 8,
          magSize: 16,
          reloadTime: 2.8,
          bNoGrip: true,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: 45.2,
              y: -4,
            },
            optic: {
              x: -21.65,
              y: -29.25,
            },
            laser: {
              bBack: true,
              x: 104,
              y: -16,
            },
            muzzle: {
              x: 153,
              y: -20.2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_STRIKER,
          name: "Striker",
          desc: "Semi-automatic combat shotgun with high power.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          bSingleRoundLoaded: true,
          damage: 28,
          accuracy: 12,
          fireRate: 10,
          magSize: 12,
          reloadTime: 0.5,
          bSmallLaser: true,
          bNoGrip: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -43.3,
              y: -40,
            },
            laser: {
              x: 53,
              y: -18,
            },
            muzzle: {
              x: 115,
              y: -23.5,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SIX12,
          name: "SIX12",
          desc: "Semi-automatic combat shotgun with good accuracy.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          damage: 20,
          accuracy: 8,
          fireRate: 4,
          magSize: 6,
          reloadTime: 2.2,
          bSmallLaser: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 15.5,
              y: -39,
            },
            laser: {
              bBack: true,
              x: 84,
              y: -15,
            },
            muzzle: {
              x: 153,
              y: -17.1,
            },
            mag: {
              x: -82.2,
              y: -4,
            },
            grip: {
              x: 60,
              y: -6,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M47,
          name: "ASG-M47",
          desc: "Pump-action combat shotgun with high power.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_12G,
          damage: 30,
          accuracy: 11,
          fireRate: 35,
          magSize: 4,
          reloadTime: 2.5,
          bEjectShell: false,
          bPump: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 11.75,
              y: -37.25,
            },
            mag: {
              x: 33.2,
              y: -7,
            },
            pump: {
              x: 120,
              y: -14,
            },
            laser: {
              x: 40,
              y: -37,
            },
            muzzle: {
              x: 164,
              y: -27.5,
            },
            grip: {
              bBack: true,
              x: 0,
              y: 14,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_JACKHAMMER,
          name: "Jackhammer",
          desc: "Fully automatic prototype shotgun.",
          type: WeaponDatabase.TYPE_SHOTGUN,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_12G,
          damage: 25,
          accuracy: 10,
          fireRate: 8,
          magSize: 10,
          reloadTime: 3.2,
          bPrestige: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 6,
              y: -41,
            },
            mag: {
              x: -76.95,
              y: 5.75,
            },
            laser: {
              x: 50,
              y: -38,
            },
            muzzle: {
              bBack: true,
              x: 134,
              y: -12,
            },
            grip: {
              x: 50,
              y: 9,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_MG4,
          unlockLevel: 1,
          name: "MG4",
          desc: "Fully automatic with moderate power.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 18,
          accuracy: 5,
          fireRate: 5,
          magSize: 100,
          reloadTime: 3.3,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -27.25,
              y: -36.5,
            },
            mag: {
              bFront: true,
              x: -2.5,
              y: 26,
            },
            laser: {
              x: 82,
              y: -32,
            },
            muzzle: {
              x: 176,
              y: -19.1,
            },
            grip: {
              bBack: true,
              x: 49,
              y: -1,
            },
            bipod: {
              bBack: true,
              x: 64,
              y: -6,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M60E4,
          name: "M60E4",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 32,
          accuracy: 4,
          fireRate: 8,
          magSize: 100,
          reloadTime: 3.8,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -80,
              y: -34,
            },
            mag: {
              bFront: true,
              x: -35,
              y: 20,
            },
            laser: {
              x: 120,
              y: -20,
            },
            muzzle: {
              x: 214.45,
              y: -12,
            },
            grip: {
              x: 12,
              y: 9,
            },
            bipod: {
              bBack: true,
              x: 140,
              y: -2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_AUGHBAR,
          name: "AUG-HBAR",
          desc: "Fully automatic with good accuracy and low recoil.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_556MM,
          damage: 22,
          accuracy: 2,
          fireRate: 5,
          magSize: 50,
          reloadTime: 2.8,
          bNoGrip: true,
          bSmallLaser: true,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: 1.4,
              y: -20.2,
            },
            mag: {
              x: -77.35,
              y: 16.2,
            },
            laser: {
              bBack: true,
              x: 46,
              y: -19,
            },
            muzzle: {
              x: 155.15,
              y: -22,
            },
            bipod: {
              bBack: true,
              x: 37,
              y: -19,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M249,
          name: "M249 SAW",
          desc: "Fully automatic with a high rate of fire.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 20,
          accuracy: 6,
          fireRate: 3,
          magSize: 100,
          reloadTime: 3.8,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -25.75,
              y: -31.85,
            },
            mag: {
              bFront: true,
              x: -2.4,
              y: 31.3,
            },
            laser: {
              x: 84,
              y: -30,
            },
            muzzle: {
              x: 172.4,
              y: -17.95,
            },
            grip: {
              x: 43,
              y: 7,
            },
            bipod: {
              x: 68,
              y: -2,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_STONER,
          name: "Stoner LMG A1",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 30,
          accuracy: 4,
          fireRate: 6,
          magSize: 50,
          reloadTime: 3.0,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -41.45,
              y: -31.2,
            },
            mag: {
              x: -6.3,
              y: 18.75,
            },
            laser: {
              x: 107,
              y: -19.5,
            },
            m203: {
              x: 44,
              y: 3,
            },
            muzzle: {
              x: 174,
              y: -20.15,
            },
            grip: {
              x: 56,
              y: 3,
            },
            bipod: {
              x: 70,
              y: 0,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_PECHENEG,
          name: "PKP Pecheneg",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 24,
          accuracy: 5,
          fireRate: 4,
          magSize: 100,
          reloadTime: 3.4,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -39,
              y: -37.8,
            },
            mag: {
              x: -21,
              y: 31.15,
            },
            laser: {
              x: 80,
              y: -28,
            },
            muzzle: {
              x: 193.85,
              y: -15.5,
            },
            grip: {
              x: 28,
              y: -2,
            },
            bipod: {
              x: 86,
              y: -7,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_RPK,
          name: "RPK",
          desc: "Fully automatic with a fast reload time.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 22,
          accuracy: 6,
          fireRate: 5,
          magSize: 100,
          reloadTime: 2.6,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -48.25,
              y: -30.4,
            },
            mag: {
              x: -22.25,
              y: 25.95,
            },
            laser: {
              x: 54,
              y: -30,
            },
            muzzle: {
              x: 185.4,
              y: -15.45,
            },
            grip: {
              bBack: true,
              x: 30,
              y: -9,
            },
            bipod: {
              x: 68,
              y: -8,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_HAMR,
          name: "HAMR",
          desc: "Fully automatic with high power.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 26,
          accuracy: 4,
          fireRate: 4,
          magSize: 100,
          reloadTime: 3.5,
          bAllowUnderbarrel: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -26.45,
              y: -28,
            },
            mag: {
              x: 3.65,
              y: 29.2,
            },
            laser: {
              x: 42,
              y: -30,
            },
            m203: {
              x: 22,
              y: -2,
            },
            muzzle: {
              x: 171.45,
              y: -11.1,
            },
            grip: {
              x: 50,
              y: 1,
            },
            bipod: {
              x: 55,
              y: -1,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_QBB95,
          name: "QBB-95",
          desc: "3-round burst with high power and low recoil.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_BURST,
          round: WeaponDatabase.ROUND_762MM,
          damage: 30,
          accuracy: 2,
          fireRate: 3,
          burstFireRate: 18,
          magSize: 60,
          reloadTime: 3.2,
          bLowRecoil: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              bBack: true,
              x: -21.5,
              y: -38.7,
            },
            mag: {
              x: -74,
              y: 28.75,
            },
            laser: {
              x: 54,
              y: -26,
            },
            muzzle: {
              x: 146.9,
              y: -7.1,
            },
            grip: {
              x: 66,
              y: 0,
            },
            bipod: {
              x: 60,
              y: -1,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_TRIDANT,
          name: "Tridant LMG",
          desc: "Fully automatic with a high rate of fire and high power.",
          type: WeaponDatabase.TYPE_LMG,
          fireMode: WeaponDatabase.MODE_AUTO,
          round: WeaponDatabase.ROUND_762MM,
          damage: 28,
          accuracy: 6,
          fireRate: 3,
          magSize: 100,
          reloadTime: 3.7,
          bPrestige: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            optic: {
              x: -27.5,
              y: -41,
            },
            mag: {
              bFront: true,
              x: 1.55,
              y: 29,
            },
            laser: {
              x: 100,
              y: -40,
            },
            muzzle: {
              x: 163.45,
              y: -22.95,
            },
            grip: {
              x: 60,
              y: -8,
            },
            bipod: {
              bBack: true,
              x: 72,
              y: -8,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M203,
          name: "M203",
          desc: "Free-fire grenade launcher.",
          type: WeaponDatabase.TYPE_LAUNCHER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_GRENADE,
          projectileType: TWP2.ProjectileBase.TYPE_GRENADE,
          damage: 200,
          accuracy: 3,
          fireRate: 20,
          magSize: 1,
          reloadTime: 1.5,
          bEjectShell: false,
          bEjectMag: false,
          points: {
            base: {
              x: 0,
              y: 0,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_XM25,
          name: "XM-25",
          desc: "Semi-automatic grenade lancher.",
          type: WeaponDatabase.TYPE_LAUNCHER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_GRENADE,
          projectileType: TWP2.ProjectileBase.TYPE_GRENADE,
          damage: 250,
          accuracy: 2,
          fireRate: 30,
          magSize: 3,
          reloadTime: 2.8,
          bEjectShell: false,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: -57.65,
              y: 25.05,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_RPG,
          name: "RPG-7",
          desc: "Free-fire rocket launcher.",
          type: WeaponDatabase.TYPE_LAUNCHER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_ROCKET,
          projectileType: TWP2.ProjectileBase.TYPE_ROCKET,
          damage: 350,
          accuracy: 3,
          fireRate: 20,
          magSize: 1,
          reloadTime: 3.0,
          bEjectShell: false,
          bEjectMag: false,
          points: {
            base: {
              x: 0,
              y: 0,
            },
            mag: {
              x: 193.35,
              y: -11,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_M32,
          name: "Milkor MGL",
          desc: "Semi-automatic sticky grenade lancher.",
          type: WeaponDatabase.TYPE_LAUNCHER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_GRENADE,
          projectileType: TWP2.ProjectileBase.TYPE_GRENADE,
          damage: 200,
          accuracy: 1,
          fireRate: 35,
          magSize: 6,
          reloadTime: 3.4,
          bEjectShell: false,
          bSticky: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_THUMPER,
          name: "M79 Thumper",
          desc: "Free-fire impact grenade launcher.",
          type: WeaponDatabase.TYPE_LAUNCHER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_GRENADE,
          projectileType: TWP2.ProjectileBase.TYPE_GRENADE,
          damage: 300,
          accuracy: 4,
          fireRate: 30,
          magSize: 2,
          reloadTime: 1.8,
          bEjectShell: false,
          bEjectMag: false,
          bImpact: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
          },
        },
        {
          id: WeaponDatabase.WEAPON_SMAW,
          name: "Mk 153 SMAW",
          desc: "Free-fire rocket launcher.",
          type: WeaponDatabase.TYPE_LAUNCHER,
          fireMode: WeaponDatabase.MODE_SEMI,
          round: WeaponDatabase.ROUND_ROCKET,
          projectileType: TWP2.ProjectileBase.TYPE_ROCKET,
          damage: 400,
          accuracy: 1,
          fireRate: 30,
          magSize: 1,
          reloadTime: 3.0,
          bEjectShell: false,
          bEjectMag: false,
          bPrestige: true,
          points: {
            base: {
              x: 0,
              y: 0,
            },
          },
        },
      ];
      var temp = {};
      for (var i = 0; i < WeaponDatabase.weapons.length; i++) {
        var weapon = WeaponDatabase.weapons[i];
        var lookModifier = 1;
        var moveModifier = 1;
        if (weapon["type"] == WeaponDatabase.TYPE_LMG) {
          lookModifier = 0.5;
        } else if (weapon["type"] == WeaponDatabase.TYPE_SNIPER) {
          lookModifier = 0.7;
        } else if (weapon["type"] == WeaponDatabase.TYPE_RIFLE) {
          lookModifier = 0.8;
        } else if (weapon["type"] == WeaponDatabase.TYPE_LAUNCHER) {
          lookModifier = 0.8;
        } else if (weapon["type"] == WeaponDatabase.TYPE_PISTOL || weapon["type"] == WeaponDatabase.TYPE_MACHINE_PISTOL) {
          lookModifier = 1.3;
          moveModifier = 1.5;
        } else if (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN) {
          moveModifier = 2;
        }
        weapon["lookModifier"] = lookModifier;
        weapon["moveModifier"] = moveModifier;
        if (weapon["type"] != WeaponDatabase.TYPE_RIFLE && weapon["type"] != WeaponDatabase.TYPE_SNIPER && weapon["type"] != WeaponDatabase.TYPE_LMG) {
          weapon["bSmallGrip"] = true;
        }
        if (weapon["type"] == WeaponDatabase.TYPE_PISTOL || weapon["type"] == WeaponDatabase.TYPE_MACHINE_PISTOL) {
          weapon["bSmallLaser"] = true;
        }
        weapon["mag"] = weapon["magSize"];
        weapon["ammo"] = weapon["magSize"] * 4;
        weapon["ammoMax"] = weapon["ammo"];
        weapon["penetration"] = WeaponDatabase.GetRoundPenetration(weapon["round"]);
        weapon["recoil"] = 1 * (weapon["damage"] * 0.2 * (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN ? 3 : 1)) - weapon["fireRate"] * 0.1;
        if (!weapon["projectileType"]) {
          weapon["projectileType"] = TWP2.ProjectileBase.TYPE_BULLET;
        }
        if (weapon["fireMode"] == WeaponDatabase.MODE_BURST) {
          weapon["bursts"] = 3;
        }
        if (weapon["bPrestige"]) {
          weapon["unlockLevel"] = 1;
        } else if (!weapon["unlockLevel"]) {
          if (!temp[weapon["type"]]) {
            temp[weapon["type"]] = WeaponDatabase.GetAllWeaponsByType(weapon["type"]);
          }
          var arr = temp[weapon["type"]];
          var numOfType = arr.length;
          var index = arr.indexOf(weapon);
          var percent = (index + 1) / numOfType;
          if (weapon["type"] == WeaponDatabase.TYPE_PISTOL) {
            percent *= 0.9;
          } else if (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN) {
            percent *= 0.95;
          }
          var value = weapon["damage"] * 0.2 + weapon["magSize"] - weapon["accuracy"] - weapon["reloadTime"] * 5;
          var modifier = 10 / value;
          if (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN) {
            modifier *= 0.1;
          }
          var unlockLevel = Math.min(Math.round(percent * TWP2.PlayerUtil.MAX_RANK) - Math.round(modifier), TWP2.PlayerUtil.MAX_RANK);
          weapon["unlockLevel"] = unlockLevel;
        }
        weapon["cost"] = weapon["unlockLevel"] * 500;
      }
      console.log("Loaded " + WeaponDatabase.weapons.length + " weapons");
      WeaponDatabase.mods = [
        {
          id: WeaponDatabase.OPTIC_DEFAULT,
          name: "None",
          desc: "Use default sights.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 0,
        },
        {
          id: WeaponDatabase.OPTIC_REFLEX_2,
          name: "Red Dot",
          desc: "Increases accuracy and view distance.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 250,
          unlockHeadshots: 25,
          modifiers: {
            accuracy: 0.8,
          },
        },
        {
          id: WeaponDatabase.OPTIC_REFLEX_1,
          name: "Reflex",
          desc: "Increases accuracy and view distance.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 500,
          unlockHeadshots: 50,
          modifiers: {
            accuracy: 0.8,
          },
        },
        {
          id: WeaponDatabase.OPTIC_EOTECH_2,
          name: "Holographic",
          desc: "Increases accuracy and view distance.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 1000,
          unlockHeadshots: 100,
          modifiers: {
            accuracy: 0.8,
          },
        },
        {
          id: WeaponDatabase.OPTIC_ACOG_1,
          name: "ACOG",
          desc: "Increases accuracy and view distance.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 1500,
          unlockHeadshots: 200,
          modifiers: {
            accuracy: 0.65,
          },
        },
        {
          id: WeaponDatabase.OPTIC_ROMEO5,
          name: "ROMEO5",
          desc: "Increases accuracy and view distance.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 2000,
          unlockHeadshots: 300,
          modifiers: {
            accuracy: 0.5,
          },
        },
        {
          id: WeaponDatabase.OPTIC_SCOPE,
          name: "Sniper Scope",
          desc: "Increases accuracy and view distance.",
          type: WeaponDatabase.MOD_OPTIC,
          cost: 1500,
          unlockHeadshots: 300,
          modifiers: {
            accuracy: 0.1,
          },
        },
        {
          id: WeaponDatabase.MAG_DEFAULT,
          name: "None",
          desc: "Use standard ammo.",
          type: WeaponDatabase.MOD_MAG,
          cost: 0,
        },
        {
          id: WeaponDatabase.MAG_FMJ,
          name: "FMJ",
          desc: "Increases bullet damage.",
          type: WeaponDatabase.MOD_MAG,
          cost: 1000,
          unlockKills: 50,
          modifiers: {
            damage: 1.2,
          },
        },
        {
          id: WeaponDatabase.MAG_EXTENDED,
          name: "Extended",
          desc: "Larger magazine size.",
          type: WeaponDatabase.MOD_MAG,
          cost: 1500,
          unlockKills: 100,
        },
        {
          id: WeaponDatabase.MAG_PIERCING,
          name: "Piercing",
          desc: "Increases bullet penetration.",
          type: WeaponDatabase.MOD_MAG,
          cost: 2000,
          unlockKills: 150,
          modifiers: {
            penetration: 2,
          },
        },
        {
          id: WeaponDatabase.MAG_HOLLOWPOINT,
          name: "Hollow Point",
          desc: "Increases headshot damage.",
          type: WeaponDatabase.MOD_MAG,
          cost: 2500,
          unlockKills: 200,
          modifiers: {
            headshotDamage: 1.5,
          },
        },
        {
          id: WeaponDatabase.MAG_EXPLOSIVE,
          name: "Explosive",
          desc: "Bullets explode on impact.",
          type: WeaponDatabase.MOD_MAG,
          cost: 3000,
          unlockKills: 300,
          modifiers: {
            penetration: 0.8,
            damage: 1.5,
          },
        },
        {
          id: WeaponDatabase.MAG_LAUNCHER_DAMAGE,
          name: "Fragmentation",
          desc: "Increases explosive damage.",
          type: WeaponDatabase.MOD_MAG,
          cost: 1500,
          unlockKills: 100,
          bLauncherOnly: true,
        },
        {
          id: WeaponDatabase.MAG_LAUNCHER_RADIUS,
          name: "High Explosive",
          desc: "Increases explosive radius.",
          type: WeaponDatabase.MOD_MAG,
          cost: 3000,
          unlockKills: 200,
          bLauncherOnly: true,
        },
        {
          id: WeaponDatabase.BASE_DEFAULT,
          name: "None",
          desc: "Use standard base.",
          type: WeaponDatabase.MOD_BASE,
          cost: 0,
        },
        {
          id: WeaponDatabase.BASE_ACCURACY,
          name: "Marksman",
          desc: "Increases accuracy.",
          type: WeaponDatabase.MOD_BASE,
          cost: 1000,
          unlockHeadshots: 50,
          modifiers: {
            accuracy: 0.75,
          },
        },
        {
          id: WeaponDatabase.BASE_SPEED_RELOAD,
          name: "Speed Loader",
          desc: "Reload all rounds immediately.",
          type: WeaponDatabase.MOD_BASE,
          cost: 1500,
          unlockHeadshots: 100,
        },
        {
          id: WeaponDatabase.BASE_FULL_AUTO,
          name: "Full Auto",
          desc: "Enables fully automatic fire.",
          type: WeaponDatabase.MOD_BASE,
          cost: 1500,
          unlockHeadshots: 100,
          modifiers: {
            accuracy: 1.2,
            recoil: 1.2,
          },
        },
        {
          id: WeaponDatabase.BASE_BURST_FIRE,
          name: "Burst",
          desc: "Enables 3-round burst fire.",
          type: WeaponDatabase.MOD_BASE,
          cost: 1500,
          unlockHeadshots: 100,
          modifiers: {
            accuracy: 0.8,
            fireRate: 0.8,
          },
        },
        {
          id: WeaponDatabase.BASE_RAPID_FIRE,
          name: "Rapid Fire",
          desc: "Increases fire rate.",
          type: WeaponDatabase.MOD_BASE,
          cost: 2000,
          unlockHeadshots: 200,
          modifiers: {
            fireRate: 0.75,
          },
        },
        {
          id: WeaponDatabase.BASE_BUCKSHOT,
          name: "Buckshot",
          desc: "More projectiles but less accuracy.",
          type: WeaponDatabase.MOD_BASE,
          cost: 2500,
          unlockHeadshots: 250,
        },
        {
          id: WeaponDatabase.BASE_RECOIL,
          name: "Shock Damper",
          desc: "Reduces recoil.",
          type: WeaponDatabase.MOD_BASE,
          cost: 3000,
          unlockHeadshots: 300,
          modifiers: {
            recoil: 0.8,
          },
        },
        {
          id: WeaponDatabase.BASE_GREED,
          name: "Greed",
          desc: "Earn double XP from kills.",
          type: WeaponDatabase.MOD_BASE,
          cost: 3500,
          unlockHeadshots: 350,
        },
        {
          id: WeaponDatabase.BARREL_DEFAULT,
          name: "None",
          desc: "No barrel attachment.",
          type: WeaponDatabase.MOD_BARREL,
          cost: 0,
        },
        {
          id: WeaponDatabase.BARREL_LASER,
          name: "Laser",
          desc: "Assists in precision.",
          type: WeaponDatabase.MOD_BARREL,
          cost: 500,
          unlockKills: 50,
        },
        {
          id: WeaponDatabase.BARREL_GRIP,
          name: "Grip",
          desc: "Reduces recoil.",
          type: WeaponDatabase.MOD_BARREL,
          cost: 1000,
          unlockKills: 100,
          modifiers: {
            recoil: 0.5,
          },
        },
        {
          id: WeaponDatabase.BARREL_BIPOD,
          name: "Bipod",
          desc: "Increases accuracy.",
          type: WeaponDatabase.MOD_BARREL,
          cost: 1500,
          unlockKills: 150,
          modifiers: {
            accuracy: 0.65,
          },
        },
        /*
              {
                  id: WeaponDatabase.BARREL_BAYONET,
                  name: "Bayonet",
                  desc: "Melee attack for close range targets.",
                  type: WeaponDatabase.MOD_BARREL,
                  cost: 2000,
                  unlockKills: 150
              },
              */
        {
          id: WeaponDatabase.BARREL_MASTERKEY,
          name: "Masterkey",
          desc: "Shotgun with 10 rounds.",
          type: WeaponDatabase.MOD_BARREL,
          cost: 3000,
          unlockKills: 200,
        },
        {
          id: WeaponDatabase.BARREL_M203,
          name: "M203",
          desc: "Grenade launcher with 5 grenades.",
          type: WeaponDatabase.MOD_BARREL,
          cost: 4000,
          unlockKills: 300,
        },
        {
          id: WeaponDatabase.MUZZLE_DEFAULT,
          name: "None",
          desc: "No muzzle attachment.",
          type: WeaponDatabase.MOD_MUZZLE,
          cost: 0,
        },
        {
          id: WeaponDatabase.MUZZLE_SUPPRESSOR,
          name: "Suppressor",
          desc: "Reduces recoil and penetration.",
          type: WeaponDatabase.MOD_MUZZLE,
          cost: 500,
          unlockKills: 100,
          modifiers: {
            recoil: 0.5,
            penetration: 0.5,
          },
        },
        {
          id: WeaponDatabase.MUZZLE_COMPENSATOR,
          name: "Compensator",
          desc: "Reduces recoil.",
          type: WeaponDatabase.MOD_MUZZLE,
          cost: 1000,
          unlockKills: 200,
          modifiers: {
            recoil: 0.8,
          },
        },
        {
          id: WeaponDatabase.MUZZLE_STABILIZER,
          name: "Stabilizer",
          desc: "Increases accuracy.",
          type: WeaponDatabase.MOD_MUZZLE,
          cost: 1500,
          unlockKills: 300,
          modifiers: {
            accuracy: 0.8,
          },
        },
        {
          id: WeaponDatabase.MUZZLE_ACCELERATOR,
          name: "Accelerator",
          desc: "Increases penetration.",
          type: WeaponDatabase.MOD_MUZZLE,
          cost: 2000,
          unlockKills: 400,
          modifiers: {
            penetration: 2,
          },
        },
        {
          id: WeaponDatabase.MUZZLE_BOOSTER,
          name: "Booster",
          desc: "Increases damage and recoil.",
          type: WeaponDatabase.MOD_MUZZLE,
          cost: 3000,
          unlockKills: 500,
          modifiers: {
            damage: 1.1,
            recoil: 1.2,
          },
        },
      ];
      console.log("Loaded " + WeaponDatabase.mods.length + " mods");
    };
    WeaponDatabase.GetRandomWeapon = function () {
      var weapons = WeaponDatabase.weapons;
      return TWP2.GameUtil.CloneObject(weapons[TWP2.MathUtil.Random(0, weapons.length - 1)]);
    };
    WeaponDatabase.GetWeaponRoundId = function (_id) {
      var weapon = WeaponDatabase.GetWeapon(_id);
      if (weapon["round"] == WeaponDatabase.ROUND_50BMG) {
        return "icon_round_50bmg";
      } else if (weapon["round"] == WeaponDatabase.ROUND_50CAL) {
        return "icon_round_50cal";
      } else if (weapon["round"] == WeaponDatabase.ROUND_44 && weapon["round"] == WeaponDatabase.ROUND_357) {
        return "icon_round_357";
      }
      if (weapon["type"] == WeaponDatabase.TYPE_RIFLE) {
        return "icon_round_rifle";
      } else if (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN) {
        return "icon_round_shotgun";
      } else if (weapon["type"] == WeaponDatabase.TYPE_SNIPER) {
        return "icon_round_sniper";
      }
      return "icon_round_default";
    };
    WeaponDatabase.GetUnlocksForKills = function (_weaponId, _kills) {
      var arr = [];
      var check = [WeaponDatabase.GetAllModsFor(WeaponDatabase.MOD_MAG, _weaponId), WeaponDatabase.GetAllModsFor(WeaponDatabase.MOD_BARREL, _weaponId), WeaponDatabase.GetAllModsFor(WeaponDatabase.MOD_MUZZLE, _weaponId)];
      for (var i = 0; i < check.length; i++) {
        var cur = check[i];
        for (var j = 0; j < cur.length; j++) {
          var mod = cur[j];
          if (mod["unlockKills"] == _kills) {
            if (WeaponDatabase.CanHaveMod(_weaponId, mod["id"]) && !WeaponDatabase.IsDefaultMod(mod["id"])) {
              if (arr.indexOf(mod["id"]) < 0) {
                arr.push(mod["id"]);
              }
            }
          }
        }
      }
      return arr;
    };
    WeaponDatabase.GetUnlocksForHeadshots = function (_weaponId, _headshots) {
      var arr = [];
      var check = [WeaponDatabase.GetAllModsFor(WeaponDatabase.MOD_BASE, _weaponId), WeaponDatabase.GetAllModsFor(WeaponDatabase.MOD_OPTIC, _weaponId)];
      for (var i = 0; i < check.length; i++) {
        var cur = check[i];
        for (var j = 0; j < cur.length; j++) {
          var mod = cur[j];
          if (mod["unlockHeadshots"] == _headshots) {
            if (WeaponDatabase.CanHaveMod(_weaponId, mod["id"]) && !WeaponDatabase.IsDefaultMod(mod["id"])) {
              if (arr.indexOf(mod["id"]) < 0) {
                arr.push(mod["id"]);
              }
            }
          }
        }
      }
      if (arr.length > 0) {
        console.log(_weaponId, _headshots);
        console.log(arr);
      }
      return arr;
    };
    WeaponDatabase.CanHaveMod = function (_weaponId, _modId) {
      if (WeaponDatabase.IsDefaultMod(_modId)) {
        return true;
      }
      var modData = WeaponDatabase.GetMod(_modId);
      var weapon = WeaponDatabase.GetWeapon(_weaponId);
      var modType = WeaponDatabase.GetModType(_modId);
      if (_modId == WeaponDatabase.BARREL_M203) {
        if (weapon["type"] != WeaponDatabase.TYPE_RIFLE) {
          return weapon["bAllowUnderbarrel"];
        }
      } else if (_modId == WeaponDatabase.BARREL_MASTERKEY) {
        if (weapon["type"] != WeaponDatabase.TYPE_RIFLE) {
          return weapon["bAllowUnderbarrel"];
        }
      } else if (_modId == WeaponDatabase.BARREL_GRIP) {
        if (WeaponDatabase.IsSecondary(_weaponId)) {
          return false;
        }
        return !weapon["bNoGrip"];
      }
      if (weapon["type"] == WeaponDatabase.TYPE_LAUNCHER) {
        return modData["bLauncherOnly"] == true;
      }
      if (modData["bLauncherOnly"] == true) {
        return weapon["type"] == WeaponDatabase.TYPE_LAUNCHER;
      }
      if (WeaponDatabase.IsSecondary(_weaponId)) {
        if (modType == WeaponDatabase.MOD_OPTIC) {
          return false;
        }
      }
      if (weapon["bRevolver"] == true) {
        if (_modId == WeaponDatabase.MUZZLE_SUPPRESSOR) {
          //return false;
        }
      }
      if (_weaponId == WeaponDatabase.WEAPON_MAXIM9) {
        if (modType == WeaponDatabase.MOD_MUZZLE) {
          return false;
        }
      }
      return true;
    };
    WeaponDatabase.GetModType = function (_id) {
      if (_id.indexOf(WeaponDatabase.MOD_OPTIC) >= 0) {
        return WeaponDatabase.MOD_OPTIC;
      } else if (_id.indexOf(WeaponDatabase.MOD_MAG) >= 0) {
        return WeaponDatabase.MOD_MAG;
      } else if (_id.indexOf(WeaponDatabase.MOD_BARREL) >= 0) {
        return WeaponDatabase.MOD_BARREL;
      } else if (_id.indexOf(WeaponDatabase.MOD_BASE) >= 0) {
        return WeaponDatabase.MOD_BASE;
      }
    };
    WeaponDatabase.IsSecondary = function (_weaponId) {
      var data = WeaponDatabase.GetWeapon(_weaponId);
      if (data) {
        if (data["type"] == WeaponDatabase.TYPE_PISTOL || data["type"] == WeaponDatabase.TYPE_MACHINE_PISTOL || data["type"] == WeaponDatabase.TYPE_LAUNCHER) {
          return true;
        }
      }
      return false;
    };
    WeaponDatabase.GetRoundPenetration = function (_round) {
      if (_round == WeaponDatabase.ROUND_50BMG) {
        return 8;
      } else if (_round == WeaponDatabase.ROUND_50CAL) {
        return 5;
      } else if (_round == WeaponDatabase.ROUND_762MM) {
        return 5;
      } else if (_round == WeaponDatabase.ROUND_44) {
        return 4;
      } else if (_round == WeaponDatabase.ROUND_556MM) {
        return 3;
      } else if (_round == WeaponDatabase.ROUND_45ACP) {
        return 2;
      } else if (_round == WeaponDatabase.ROUND_GRENADE) {
        return 5;
      } else if (_round == WeaponDatabase.ROUND_ROCKET) {
        return 8;
      }
      return 1;
    };
    WeaponDatabase.GetAllModsFor = function (_modType, _weaponId) {
      var arr = [];
      var weapon = WeaponDatabase.GetWeapon(_weaponId);
      for (var i = 0; i < WeaponDatabase.mods.length; i++) {
        if (WeaponDatabase.mods[i]["type"] == _modType) {
          arr.push(WeaponDatabase.mods[i]["id"]);
        }
      }
      var index;
      if (_modType == WeaponDatabase.MOD_BASE) {
        if (TWP2.GameUtil.GetGameState()) {
          if (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.GameMode_Range) {
            index = arr.indexOf(WeaponDatabase.BASE_GREED);
            if (index >= 0) {
              arr.splice(index, 1);
            }
          }
        }
        if (weapon["bSingleRoundLoaded"] != true) {
          index = arr.indexOf(WeaponDatabase.BASE_SPEED_RELOAD);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
        if (weapon["fireMode"] != WeaponDatabase.MODE_BURST) {
          index = arr.indexOf(WeaponDatabase.BASE_FULL_AUTO);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
        if (weapon["type"] != WeaponDatabase.TYPE_SMG) {
          index = arr.indexOf(WeaponDatabase.BASE_BURST_FIRE);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
        if (weapon["type"] != WeaponDatabase.TYPE_SHOTGUN) {
          index = arr.indexOf(WeaponDatabase.BASE_BUCKSHOT);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
        if (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN) {
          index = arr.indexOf(WeaponDatabase.BASE_RECOIL);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
      } else if (_modType == WeaponDatabase.MOD_OPTIC) {
        if (weapon["type"] != WeaponDatabase.TYPE_SNIPER) {
          index = arr.indexOf(WeaponDatabase.OPTIC_SCOPE);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        } else {
          index = arr.indexOf(WeaponDatabase.OPTIC_ROMEO5);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
      } else if (_modType == WeaponDatabase.MOD_BARREL) {
        if (weapon["bPump"] == true) {
          index = arr.indexOf(WeaponDatabase.BARREL_GRIP);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
        if (weapon["type"] != WeaponDatabase.TYPE_SNIPER && weapon["type"] != WeaponDatabase.TYPE_LMG) {
          index = arr.indexOf(WeaponDatabase.BARREL_BIPOD);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
      }
      var mods = [];
      for (var i = 0; i < arr.length; i++) {
        if (WeaponDatabase.CanHaveMod(_weaponId, arr[i])) {
          mods.push(WeaponDatabase.GetMod(arr[i]));
        }
      }
      return mods;
    };
    WeaponDatabase.GetSuppressedSoundId = function (_data) {
      if (_data["type"] == WeaponDatabase.TYPE_PISTOL) {
        return "wpn_fire_suppressor_pistol";
      } else if (_data["type"] == WeaponDatabase.TYPE_SMG) {
        return "wpn_fire_suppressor_smg";
      } else if (_data["type"] == WeaponDatabase.TYPE_RIFLE) {
        return "wpn_fire_suppressor_rifle";
      } else if (_data["type"] == WeaponDatabase.TYPE_SNIPER) {
        return "wpn_fire_suppressor_sniper";
      } else if (_data["type"] == WeaponDatabase.TYPE_SHOTGUN) {
        return "wpn_fire_suppressor_shotgun";
      } else if (_data["type"] == WeaponDatabase.TYPE_LMG) {
        return "wpn_fire_suppressor_lmg";
      }
      return "wpn_fire_suppressor_smg";
    };
    WeaponDatabase.GetDefaultModsFor = function (_weaponId) {
      return {
        base: WeaponDatabase.BASE_DEFAULT,
        optic: WeaponDatabase.OPTIC_DEFAULT,
        mag: WeaponDatabase.MAG_DEFAULT,
        barrel: WeaponDatabase.BARREL_DEFAULT,
        muzzle: WeaponDatabase.MUZZLE_DEFAULT,
      };
    };
    WeaponDatabase.GetDefaultModForModType = function (_modType) {
      if (_modType == WeaponDatabase.MOD_BASE) {
        return WeaponDatabase.BASE_DEFAULT;
      } else if (_modType == WeaponDatabase.MOD_OPTIC) {
        return WeaponDatabase.OPTIC_DEFAULT;
      } else if (_modType == WeaponDatabase.MOD_MAG) {
        return WeaponDatabase.MAG_DEFAULT;
      } else if (_modType == WeaponDatabase.MOD_MUZZLE) {
        return WeaponDatabase.MUZZLE_DEFAULT;
      } else if (_modType == WeaponDatabase.MOD_BARREL) {
        return WeaponDatabase.BARREL_DEFAULT;
      }
      return null;
    };
    WeaponDatabase.GetModString = function (_id) {
      if (_id == WeaponDatabase.MOD_BARREL) {
        return "Barrel";
      } else if (_id == WeaponDatabase.MOD_BASE) {
        return "Base";
      } else if (_id == WeaponDatabase.MOD_OPTIC) {
        return "Optic";
      } else if (_id == WeaponDatabase.MOD_MAG) {
        return "Ammo";
      } else if (_id == WeaponDatabase.MOD_MUZZLE) {
        return "Muzzle";
      }
      return null;
    };
    WeaponDatabase.IsModType = function (_modId, _modType) {
      var mod = WeaponDatabase.GetMod(_modId);
      if (mod) {
        return mod["type"] == _modType;
      }
      return false;
    };
    WeaponDatabase.ApplyWeaponMods = function (_weaponData, _modData) {
      var weapon = _weaponData;
      weapon["optic"] = _modData["optic"];
      weapon["barrel"] = _modData["barrel"];
      weapon["magMod"] = _modData["mag"];
      weapon["muzzleMod"] = _modData["muzzle"];
      weapon["baseMod"] = _modData["base"];
      if (weapon["magMod"] == WeaponDatabase.MAG_EXTENDED) {
        weapon["magSize"] = Math.round(weapon["magSize"] * 1.5);
        weapon["mag"] = weapon["magSize"];
      } else if (weapon["magMod"] == WeaponDatabase.MAG_PIERCING) {
        weapon["penetration"] += 2;
      }
      if (weapon["muzzleMod"] == WeaponDatabase.MUZZLE_BOOSTER) {
        weapon["damage"] *= 1.1;
        weapon["accuracy"] *= 1.2;
      } else if (weapon["muzzleMod"] == WeaponDatabase.MUZZLE_SUPPRESSOR) {
        weapon["accuracy"] *= 0.85;
        weapon["penetration"] = Math.max(1, weapon["penetration"] - 1);
      } else if (weapon["muzzleMod"] == WeaponDatabase.MUZZLE_ACCELERATOR) {
        weapon["penetration"] += 2;
      } else if (weapon["muzzleMod"] == WeaponDatabase.MUZZLE_STABILIZER) {
        weapon["accuracy"] *= 0.8;
      }
      if (weapon["barrel"] == WeaponDatabase.BARREL_M203) {
        weapon["grenadesMax"] = 5;
        weapon["grenades"] = weapon["grenadesMax"];
      } else if (weapon["barrel"] == WeaponDatabase.BARREL_MASTERKEY) {
        weapon["grenadesMax"] = 10;
        weapon["grenades"] = weapon["grenadesMax"];
      } else if (weapon["barrel"] == WeaponDatabase.BARREL_BIPOD) {
        weapon["accuracy"] *= 0.65;
      }
      if (weapon["baseMod"] == WeaponDatabase.BASE_SPEED_RELOAD) {
        weapon["bSingleRoundLoaded"] = false;
        weapon["reloadTime"] *= weapon["magSize"] * 0.5;
      } else if (weapon["baseMod"] == WeaponDatabase.BASE_FULL_AUTO) {
        weapon["fireMode"] = WeaponDatabase.MODE_AUTO;
        weapon["accuracy"] *= 1.1;
      } else if (weapon["baseMod"] == WeaponDatabase.BASE_BURST_FIRE) {
        weapon["fireMode"] = WeaponDatabase.MODE_BURST;
        weapon["accuracy"] *= 0.8;
        weapon["bursts"] = 3;
        weapon["burstFireRate"] = weapon["fireRate"] * 4;
        weapon["fireRate"] = Math.min(weapon["fireRate"] * 0.7, 4);
      } else if (weapon["baseMod"] == WeaponDatabase.BASE_ACCURACY) {
        weapon["accuracy"] *= 0.75;
      } else if (weapon["baseMod"] == WeaponDatabase.BASE_RAPID_FIRE) {
        weapon["fireRate"] = Math.ceil(weapon["fireRate"] * 0.6);
      } else if (weapon["baseMod"] == WeaponDatabase.BASE_BUCKSHOT) {
        weapon["damage"] *= 0.9;
        weapon["accuracy"] *= 2;
      }
      if (WeaponDatabase.IsDefaultMod(weapon["optic"])) {
        if (weapon["optic"] == WeaponDatabase.OPTIC_SCOPE || weapon["optic"] == WeaponDatabase.OPTIC_ROMEO5) {
          weapon["accuracy"] *= 0.85;
        } else {
          weapon["accuracy"] *= 0.9;
        }
      }
    };
    WeaponDatabase.IsUsableBarrelMod = function (_id) {
      if (_id == WeaponDatabase.BARREL_LASER || _id == WeaponDatabase.BARREL_M203 || _id == WeaponDatabase.BARREL_MASTERKEY) {
        return true;
      }
      return false;
    };
    WeaponDatabase.GetTrueModTypeString = function (_val) {
      if (_val == "mag") {
        return "magMod";
      } else if (_val == "base") {
        return "baseMod";
      } else if (_val == "muzzle") {
        return "muzzleMod";
      }
      return _val;
    };
    WeaponDatabase.IsDefaultMod = function (_id) {
      if (!_id) {
        return false;
      }
      if (
        _id.indexOf(WeaponDatabase.BASE_DEFAULT) >= 0 ||
        _id.indexOf(WeaponDatabase.OPTIC_DEFAULT) >= 0 ||
        _id.indexOf(WeaponDatabase.MAG_DEFAULT) >= 0 ||
        _id.indexOf(WeaponDatabase.MUZZLE_DEFAULT) >= 0 ||
        _id.indexOf(WeaponDatabase.BARREL_DEFAULT) >= 0
      ) {
        return true;
      }
      return false;
    };
    WeaponDatabase.GetAvailableModsFor = function (_id) {
      var weapon = WeaponDatabase.GetWeapon(_id);
      if (weapon["type"] == WeaponDatabase.TYPE_PISTOL || weapon["type"] == WeaponDatabase.TYPE_MACHINE_PISTOL) {
        if (_id == WeaponDatabase.WEAPON_MAXIM9) {
          return [WeaponDatabase.MOD_BASE, WeaponDatabase.MOD_MAG];
        }
        return [WeaponDatabase.MOD_BASE, WeaponDatabase.MOD_MAG, WeaponDatabase.MOD_BARREL, WeaponDatabase.MOD_MUZZLE];
      } else if (weapon["type"] == WeaponDatabase.TYPE_LAUNCHER) {
        return [WeaponDatabase.MOD_MAG];
      }
      return [WeaponDatabase.MOD_BASE, WeaponDatabase.MOD_OPTIC, WeaponDatabase.MOD_MAG, WeaponDatabase.MOD_BARREL, WeaponDatabase.MOD_MUZZLE];
    };
    WeaponDatabase.GetWeapon = function (_id) {
      for (var i = 0; i < WeaponDatabase.weapons.length; i++) {
        if (WeaponDatabase.weapons[i]["id"] == _id) {
          return TWP2.GameUtil.CloneObject(WeaponDatabase.weapons[i]);
        }
      }
      return null;
    };
    WeaponDatabase.GetAllPrestigeWeapons = function () {
      var arr = [];
      var weapons = WeaponDatabase.weapons;
      for (var i = 0; i < weapons.length; i++) {
        if (weapons[i]["bPrestige"] == true) {
          arr.push(weapons[i]);
        }
      }
      return arr;
    };
    WeaponDatabase.GetAllWeaponsByType = function (_type) {
      var arr = [];
      var weapons = WeaponDatabase.weapons;
      for (var i = 0; i < weapons.length; i++) {
        if (weapons[i]["type"] == _type) {
          arr.push(weapons[i]);
        }
      }
      return arr;
    };
    WeaponDatabase.GetAllWeaponsByUnlockLevel = function (_level) {
      var arr = [];
      var weapons = WeaponDatabase.weapons;
      for (var i = 0; i < weapons.length; i++) {
        if (weapons[i]["unlockLevel"] == _level) {
          arr.push({ type: "weapon", id: weapons[i]["id"] });
        }
      }
      return arr;
    };
    WeaponDatabase.GetMod = function (_id) {
      for (var i = 0; i < WeaponDatabase.mods.length; i++) {
        if (WeaponDatabase.mods[i]["id"] == _id) {
          return TWP2.GameUtil.CloneObject(WeaponDatabase.mods[i]);
        }
      }
      return null;
    };
    WeaponDatabase.GetAllIds = function () {
      var arr = [];
      for (var i = 0; i < WeaponDatabase.weapons.length; i++) {
        arr.push(WeaponDatabase.weapons[i]["id"]);
      }
      return arr;
    };
    WeaponDatabase.GetAllByType = function (_type) {
      var arr = [];
      for (var i = 0; i < WeaponDatabase.weapons.length; i++) {
        var cur = WeaponDatabase.weapons[i];
        if (cur["type"] == _type) {
          arr.push(TWP2.GameUtil.CloneObject(cur));
        }
      }
      return arr;
    };
    WeaponDatabase.GetTypeString = function (_type) {
      if (_type == WeaponDatabase.TYPE_PISTOL) {
        return "Pistol";
      } else if (_type == WeaponDatabase.TYPE_MACHINE_PISTOL) {
        return "Machine Pistol";
      } else if (_type == WeaponDatabase.TYPE_SMG) {
        return "Submachine Gun";
      } else if (_type == WeaponDatabase.TYPE_SNIPER) {
        return "High-Powered Rifle";
      } else if (_type == WeaponDatabase.TYPE_RIFLE) {
        return "Assault Rifle";
      } else if (_type == WeaponDatabase.TYPE_LMG) {
        return "Light Machine Gun";
      } else if (_type == WeaponDatabase.TYPE_SHOTGUN) {
        return "Shotgun";
      } else if (_type == WeaponDatabase.TYPE_LAUNCHER) {
        return "Launcher";
      }
      return null;
    };
    WeaponDatabase.GetPrimaryWeaponTypes = function () {
      return [WeaponDatabase.TYPE_SMG, WeaponDatabase.TYPE_SHOTGUN, WeaponDatabase.TYPE_RIFLE, WeaponDatabase.TYPE_SNIPER, WeaponDatabase.TYPE_LMG];
    };
    WeaponDatabase.GetSecondaryWeaponTypes = function () {
      return [WeaponDatabase.TYPE_PISTOL, WeaponDatabase.TYPE_MACHINE_PISTOL, WeaponDatabase.TYPE_LAUNCHER];
    };
    /* Modes */
    WeaponDatabase.MODE_AUTO = "MODE_AUTO";
    WeaponDatabase.MODE_BURST = "MODE_BURST";
    WeaponDatabase.MODE_SEMI = "MODE_SEMI";
    /* Types */
    WeaponDatabase.TYPE_PISTOL = "TYPE_PISTOL";
    WeaponDatabase.TYPE_MACHINE_PISTOL = "TYPE_MACHINE_PISTOL";
    WeaponDatabase.TYPE_SMG = "TYPE_SMG";
    WeaponDatabase.TYPE_SHOTGUN = "TYPE_SHOTGUN";
    WeaponDatabase.TYPE_SNIPER = "TYPE_SNIPER";
    WeaponDatabase.TYPE_RIFLE = "TYPE_RIFLE";
    WeaponDatabase.TYPE_LMG = "TYPE_LMG";
    WeaponDatabase.TYPE_LAUNCHER = "TYPE_LAUNCHER";
    /* Rounds */
    WeaponDatabase.ROUND_12G = "12g";
    WeaponDatabase.ROUND_9MM = "9mm";
    WeaponDatabase.ROUND_556MM = "556mm";
    WeaponDatabase.ROUND_762MM = "762mm";
    WeaponDatabase.ROUND_50BMG = "50bmg";
    WeaponDatabase.ROUND_45ACP = "45acp";
    WeaponDatabase.ROUND_50CAL = "50cal";
    WeaponDatabase.ROUND_44 = "50cal";
    WeaponDatabase.ROUND_357 = "50cal";
    WeaponDatabase.ROUND_ROCKET = "rocket";
    WeaponDatabase.ROUND_GRENADE = "grenade";
    /* Mods */
    WeaponDatabase.MOD_BASE = "base";
    WeaponDatabase.MOD_OPTIC = "optic";
    WeaponDatabase.MOD_MAG = "mag";
    WeaponDatabase.MOD_BARREL = "barrel";
    WeaponDatabase.MOD_MUZZLE = "muzzle";
    WeaponDatabase.BASE_DEFAULT = "base0000";
    WeaponDatabase.BASE_SPEED_RELOAD = "base_speed_reload";
    WeaponDatabase.BASE_FULL_AUTO = "base_full_auto";
    WeaponDatabase.BASE_BURST_FIRE = "base_burst_fire";
    WeaponDatabase.BASE_RAPID_FIRE = "base_rapid_fire";
    WeaponDatabase.BASE_BUCKSHOT = "base_buckshot";
    WeaponDatabase.BASE_GREED = "base_greed";
    WeaponDatabase.BASE_ACCURACY = "base_accuracy";
    WeaponDatabase.BASE_RECOIL = "base_recoil";
    WeaponDatabase.OPTIC_DEFAULT = "optic0000";
    WeaponDatabase.OPTIC_REFLEX_1 = "optic0001";
    WeaponDatabase.OPTIC_REFLEX_2 = "optic0002";
    WeaponDatabase.OPTIC_EOTECH_1 = "optic0003";
    WeaponDatabase.OPTIC_EOTECH_2 = "optic0004";
    WeaponDatabase.OPTIC_ACOG_1 = "optic0005";
    WeaponDatabase.OPTIC_ROMEO5 = "optic0006";
    WeaponDatabase.OPTIC_SCOPE = "optic0007";
    WeaponDatabase.PUMP_DEFAULT = "pump0000";
    WeaponDatabase.SLIDE_DEFAULT = "slide0000";
    WeaponDatabase.MAG_DEFAULT = "mag0000";
    WeaponDatabase.MAG_FMJ = "mag0001";
    WeaponDatabase.MAG_EXTENDED = "mag0002";
    WeaponDatabase.MAG_HOLLOWPOINT = "mag0003";
    WeaponDatabase.MAG_EXPLOSIVE = "mag0004";
    WeaponDatabase.MAG_PIERCING = "mag0005";
    WeaponDatabase.MAG_LAUNCHER_RADIUS = "mag0006";
    WeaponDatabase.MAG_LAUNCHER_DAMAGE = "mag0007";
    WeaponDatabase.BARREL_DEFAULT = "barrel0000";
    WeaponDatabase.BARREL_LASER = "barrel0001";
    WeaponDatabase.BARREL_LASER_SMALL = "barrel0009";
    WeaponDatabase.BARREL_M203 = "barrel0002";
    WeaponDatabase.BARREL_M203_SMALL = "barrel0003";
    WeaponDatabase.BARREL_MUZZLE = "barrel0004";
    WeaponDatabase.BARREL_BAYONET = "barrel0005";
    WeaponDatabase.BARREL_GRIP = "barrel0006";
    WeaponDatabase.BARREL_GRIP_SMALL = "barrel0010";
    WeaponDatabase.BARREL_MASTERKEY = "barrel0007";
    WeaponDatabase.BARREL_MASTERKEY_SMALL = "barrel0008";
    WeaponDatabase.BARREL_BIPOD = "barrel0011";
    WeaponDatabase.MUZZLE_DEFAULT = "muzzle0000";
    WeaponDatabase.MUZZLE_BOOSTER = "muzzle0001";
    WeaponDatabase.MUZZLE_COMPENSATOR = "muzzle0002";
    WeaponDatabase.MUZZLE_SUPPRESSOR = "muzzle0003";
    WeaponDatabase.MUZZLE_ACCELERATOR = "muzzle0004";
    WeaponDatabase.MUZZLE_STABILIZER = "muzzle0005";
    /* Weapons */
    WeaponDatabase.WEAPON_M9 = "m9";
    WeaponDatabase.WEAPON_USP45 = "usp45";
    WeaponDatabase.WEAPON_P320 = "p320";
    WeaponDatabase.WEAPON_FIVESEVEN = "fiveseven";
    WeaponDatabase.WEAPON_MAXIM9 = "maxim9";
    WeaponDatabase.WEAPON_G17 = "g17";
    WeaponDatabase.WEAPON_DEAGLE = "deagle";
    WeaponDatabase.WEAPON_MAGNUM = "magnum";
    WeaponDatabase.WEAPON_RHINO = "rhino";
    WeaponDatabase.WEAPON_OTS38 = "ots38";
    WeaponDatabase.WEAPON_M1911 = "m1911";
    WeaponDatabase.WEAPON_M93R = "m93r";
    WeaponDatabase.WEAPON_VP70 = "vp70";
    WeaponDatabase.WEAPON_G18 = "g18";
    WeaponDatabase.WEAPON_FMG9 = "fmg9";
    WeaponDatabase.WEAPON_KARD = "kard";
    WeaponDatabase.WEAPON_MP1911 = "mp1911";
    WeaponDatabase.WEAPON_USPM = "uspm";
    WeaponDatabase.WEAPON_MP9 = "mp9";
    WeaponDatabase.WEAPON_MPA57 = "mpa57";
    WeaponDatabase.WEAPON_SKORPION = "skorpion";
    WeaponDatabase.WEAPON_MP5 = "mp5";
    WeaponDatabase.WEAPON_MP7 = "mp7";
    WeaponDatabase.WEAPON_VECTOR = "vector";
    WeaponDatabase.WEAPON_P90 = "p90";
    WeaponDatabase.WEAPON_MAC10 = "mac10";
    WeaponDatabase.WEAPON_VSK = "vsk";
    WeaponDatabase.WEAPON_AUGPARA = "augpara";
    WeaponDatabase.WEAPON_UMP45 = "ump45";
    WeaponDatabase.WEAPON_AK74U = "ak74u";
    WeaponDatabase.WEAPON_HK416C = "hk416c";
    WeaponDatabase.WEAPON_ARP = "arp";
    WeaponDatabase.WEAPON_PDR = "pdr";
    WeaponDatabase.WEAPON_PSG = "psg";
    WeaponDatabase.WEAPON_EVO3 = "evo3";
    WeaponDatabase.WEAPON_HONEYBADGER = "honeybadger";
    WeaponDatabase.WEAPON_M16A4 = "m16a4";
    WeaponDatabase.WEAPON_M4 = "m4";
    WeaponDatabase.WEAPON_LE6940 = "le6940";
    WeaponDatabase.WEAPON_G36C = "g36c";
    WeaponDatabase.WEAPON_SCARL = "scarl";
    WeaponDatabase.WEAPON_HK416 = "hk416";
    WeaponDatabase.WEAPON_GALIL = "galil";
    WeaponDatabase.WEAPON_GALIL52 = "galil52";
    WeaponDatabase.WEAPON_AUG = "aug";
    WeaponDatabase.WEAPON_AK47 = "ak47";
    WeaponDatabase.WEAPON_TAR21 = "tar21";
    WeaponDatabase.WEAPON_TAVOR = "tavor";
    WeaponDatabase.WEAPON_FAMAS = "famas";
    WeaponDatabase.WEAPON_TYPE95 = "type95";
    WeaponDatabase.WEAPON_FG42 = "fg42";
    WeaponDatabase.WEAPON_M40A3 = "m40a3";
    WeaponDatabase.WEAPON_MB13 = "mb13";
    WeaponDatabase.WEAPON_RSASS = "rsass";
    WeaponDatabase.WEAPON_SAMR = "samr";
    WeaponDatabase.WEAPON_HTI = "hti";
    WeaponDatabase.WEAPON_SRS = "srs";
    WeaponDatabase.WEAPON_SR25 = "sr25";
    WeaponDatabase.WEAPON_MSR = "msr";
    WeaponDatabase.WEAPON_BFG = "bfg";
    WeaponDatabase.WEAPON_AUG5G = "aug5g";
    WeaponDatabase.WEAPON_M82A1 = "m82a1";
    WeaponDatabase.WEAPON_PSG1 = "psg1";
    WeaponDatabase.WEAPON_HK417 = "hk417";
    WeaponDatabase.WEAPON_TPR = "tpr";
    WeaponDatabase.WEAPON_L115A3 = "l115a3";
    WeaponDatabase.WEAPON_DB = "db";
    WeaponDatabase.WEAPON_SHORTY = "shorty";
    WeaponDatabase.WEAPON_M1014 = "m1014";
    WeaponDatabase.WEAPON_M1216 = "m1216";
    WeaponDatabase.WEAPON_M3 = "m3";
    WeaponDatabase.WEAPON_R870 = "r870";
    WeaponDatabase.WEAPON_M47 = "m47";
    WeaponDatabase.WEAPON_KSG = "ksg";
    WeaponDatabase.WEAPON_STRIKER = "striker";
    WeaponDatabase.WEAPON_SIX12 = "six12";
    WeaponDatabase.WEAPON_SPAS12 = "spas12";
    WeaponDatabase.WEAPON_MOSSBERG = "mossberg";
    WeaponDatabase.WEAPON_AA12 = "aa12";
    WeaponDatabase.WEAPON_SAIGA = "saiga";
    WeaponDatabase.WEAPON_JACKHAMMER = "jackhammer";
    WeaponDatabase.WEAPON_M249 = "m249";
    WeaponDatabase.WEAPON_HAMR = "hamr";
    WeaponDatabase.WEAPON_TRIDANT = "tridant";
    WeaponDatabase.WEAPON_STONER = "stoner";
    WeaponDatabase.WEAPON_QBB95 = "qbb95";
    WeaponDatabase.WEAPON_AUGHBAR = "aughbar";
    WeaponDatabase.WEAPON_PECHENEG = "pecheneg";
    WeaponDatabase.WEAPON_M60E4 = "m60e4";
    WeaponDatabase.WEAPON_MG4 = "mg4";
    WeaponDatabase.WEAPON_RPK = "rpk";
    WeaponDatabase.WEAPON_RPG = "rpg";
    WeaponDatabase.WEAPON_SMAW = "smaw";
    WeaponDatabase.WEAPON_M203 = "m203";
    WeaponDatabase.WEAPON_XM25 = "xm25";
    WeaponDatabase.WEAPON_M32 = "m32";
    WeaponDatabase.WEAPON_THUMPER = "thumper";
    return WeaponDatabase;
  })();
  TWP2.WeaponDatabase = WeaponDatabase;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    function Engine() {
      var _this = _super.call(this, 1000, 600, Phaser.AUTO, "content") || this;
      _this.bInit = false;
      _this.keyMenu = null;
      _this.state.add(Engine.STATE_BOOT, TWP2.State_Boot, true);
      _this.state.add(Engine.STATE_PRELOADER, TWP2.State_Preloader, false);
      _this.state.add(Engine.STATE_SPONSOR, TWP2.State_Sponsor, false);
      _this.state.add(Engine.STATE_INTRO, TWP2.State_Intro, false);
      _this.state.add(Engine.STATE_MENU, TWP2.State_Menu, false);
      _this.state.add(Engine.STATE_GAME, TWP2.State_Game, false);
      return _this;
    }
    Engine.prototype.initialize = function () {
      this.ui = this.add.group(null, "ui", true);
      this.achievements = this.add.group(null, "achievements", true);
      this.elements = [];
      this.pendingAchievements = [];
      TWP2.WeaponDatabase.Initialize();
      TWP2.GameModeDatabase.Initialize();
      TWP2.SkillDatabase.Initialize();
      TWP2.Achievements.Initialize();
      TWP2.PlayerUtil.Initialize();
      this.initAPI();
      this.bInit = true;
    };
    Engine.prototype.initAPI = function () {
      if (this.desiredAPI == "armor_games") {
        if (this.ag) {
          TWP2.APIUtil.CurrentAPI = TWP2.APIUtil.API_ARMOR_GAMES;
        }
      } else if (this.desiredAPI == "newgrounds") {
        if (this.ngio) {
          TWP2.APIUtil.CurrentAPI = TWP2.APIUtil.API_NEWGROUNDS;
        }
      } else if (this.desiredAPI == "kongregate") {
        if (this.kong) {
          TWP2.APIUtil.CurrentAPI = TWP2.APIUtil.API_KONGREGATE;
        }
      } else {
        console.warn("Invalid API");
      }
      if (this.cpmstarAPI) {
        TWP2.AdUtil.cpmstarAPI = this.cpmstarAPI;
      } else {
        console.warn("invalid CPMStar API");
      }
      TWP2.APIUtil.Init();
    };
    Engine.prototype.onEvent = function (_name) {
      console.log("Engine::onEvent " + _name);
      if (_name == "SDK_GAME_START") {
        TWP2.AdUtil.OnResumeGame();
      } else if (_name == "SDK_GAME_PAUSE") {
        TWP2.AdUtil.OnPauseGame();
      } else if (_name == "AD_CANCELED") {
        TWP2.AdUtil.SetWasCancelled(true);
      } else if (_name == "SDK_GDPR_TRACKING") {
        //this event is triggered when your user doesn't want to be tracked
      } else if (_name == "SDK_GDPR_TARGETING") {
        //this event is triggered when your user doesn't want personalised targeting of ads and such
      } else if (_name == "SDK_ERROR") {
        TWP2.AdUtil.SetError(true);
      }
    };
    Engine.prototype.onAdOpened = function () {};
    Engine.prototype.onAdClosed = function () {
      TWP2.AdUtil.OnResumeGame();
    };
    Engine.prototype.addUIElement = function (_element) {
      this.ui.add(_element);
      this.elements.push(_element);
      this.updateUIBlurs();
    };
    Engine.prototype.updateUIBlurs = function () {
      if (this.ui) {
        var topChild;
        for (var i = 0; i < this.elements.length; i++) {
          var child = this.elements[i];
          var bBlur = true;
          if (i == this.elements.length - 1) {
            topChild = child;
            bBlur = false;
          }
          this.setBlur(child, bBlur);
        }
        if (topChild) {
          var curParent = topChild;
          while (curParent) {
            this.setBlur(curParent, false);
            curParent = curParent.parent;
          }
        }
      }
    };
    Engine.prototype.removeUIElement = function (_element) {
      this.ui.remove(_element);
      var index = this.elements.indexOf(_element);
      if (index >= 0) {
        this.elements.splice(this.elements.indexOf(_element), 1);
      }
      this.updateUIBlurs();
    };
    Engine.prototype.setBlur = function (_item, _bVal) {
      if (_bVal) {
        var blurX = this.add.filter("BlurX");
        var blurY = this.add.filter("BlurY");
        blurX.blur = 18;
        blurY.blur = blurX.blur;
        _item.filters = [blurX, blurY, blurX, blurY];
      } else {
        _item.filters = undefined;
      }
    };
    Engine.prototype.showMouse = function (_bVal) {
      var element = document.getElementById("content");
      if (element) {
        element.style.cursor = _bVal ? "default" : "none";
      }
    };
    Engine.prototype.mouseIsVisible = function () {
      var element = document.getElementById("content");
      if (element) {
        return element.style.cursor == "default";
      }
      return false;
    };
    Engine.prototype.openSetKeyMenu = function (_id, _callback, _callbackContext) {
      if (this.keyMenu) {
        this.keyMenu.destroy();
      }
      this.keyMenu = new TWP2.SetKeyMenu(_id, _callback, _callbackContext);
      return this.keyMenu;
    };
    Engine.prototype.onSetKeyMenuDestroyed = function () {
      this.keyMenu = null;
    };
    Engine.prototype.loadSponsor = function () {
      this.state.start("SponsorState", true, false);
      this.onStateChanged();
    };
    Engine.prototype.loadIntro = function () {
      this.state.start("IntroState", true, false);
      this.onStateChanged();
    };
    Engine.prototype.loadMenuState = function (_menuId) {
      if (_menuId === void 0) {
        _menuId = null;
      }
      this.state.start(Engine.STATE_MENU, true, false, _menuId);
      this.onStateChanged();
    };
    Engine.prototype.loadGameState = function (_data) {
      this.state.start(Engine.STATE_GAME, true, false, _data);
      this.onStateChanged();
    };
    Engine.prototype.loadMenu = function (_menuId) {
      if (_menuId === void 0) {
        _menuId = null;
      }
      if (this.state.getCurrentState() instanceof TWP2.State_Game) {
        TWP2.GameUtil.GetGameState().destroyGame();
      }
      TWP2.GameUtil.game.savePlayerData();
      this.state.start("MenuState", true, false, _menuId);
      this.onStateChanged();
    };
    Engine.prototype.prepareGame = function (_data) {
      var mainMenu = this.getMainMenu();
      if (mainMenu) {
        mainMenu.setOnCloseCallback(this.createPreGameMenu, this, [_data]);
        mainMenu.close();
      } else {
        this.createPreGameMenu(_data);
      }
    };
    Engine.prototype.restartGame = function () {
      if (this.state.getCurrentState() instanceof TWP2.State_Game) {
        var data = TWP2.GameUtil.GetGameState().getData();
        TWP2.GameUtil.GetGameState().destroyGame();
        this.startGameState(data);
      }
    };
    Engine.prototype.createPreGameMenu = function (_data) {
      var menuState = this.state.getCurrentState();
      if (menuState) {
        menuState.loadPreGameMenu(_data);
      }
    };
    Engine.prototype.startGameState = function (_data) {
      this.ui.removeAll(true);
      this.state.start("GameState", true, false, _data);
      this.onStateChanged();
    };
    Engine.prototype.getMainMenu = function () {
      if (this.state.getCurrentState() instanceof TWP2.State_Menu) {
        var menuState = this.state.getCurrentState();
        if (menuState) {
          return menuState.getMainMenu();
        }
      }
      return null;
    };
    Engine.prototype.onStateChanged = function () {
      while (this.achievements.length > 0) {
        var child = this.achievements.getAt(0);
        if (child) {
          child.destroy();
        }
      }
      this.pendingAchievements = [];
    };
    Engine.prototype.pushAchievement = function (_id) {
      this.pendingAchievements.push(_id);
      if (this.pendingAchievements.length == 1) {
        this.showNextAchivement();
      }
    };
    Engine.prototype.showNextAchivement = function () {
      var id = this.pendingAchievements[0];
      var bubble = new TWP2.AchievementBubble();
      var padding = 10;
      bubble.x = this.width - bubble.width - padding;
      bubble.y = padding;
      bubble.setAchievement(id);
      this.achievements.add(bubble);
    };
    Engine.prototype.onAchievementHidden = function () {
      this.pendingAchievements.splice(0, 1);
      if (this.pendingAchievements.length > 0) {
        this.showNextAchivement();
      }
    };
    Engine.prototype.getSplashMenu = function () {
      if (this.state.getCurrentState() instanceof TWP2.State_Menu) {
        var menuState = this.state.getCurrentState();
        if (menuState) {
          return menuState.getSplashMenu();
        }
      }
      return null;
    };
    Engine.prototype.createWindow = function (_data) {
      var window = new TWP2.Window();
      window.setFromData(_data);
      return window;
    };
    Engine.prototype.savePlayerData = function () {
      console.log("Save player data");
      console.log(TWP2.PlayerUtil.player);
      var string = JSON.stringify(TWP2.PlayerUtil.player);
      localStorage.setItem("xwilkinx_twp2_player", string);
      if (TWP2.APIUtil.CanSaveData()) {
        TWP2.APIUtil.SaveData();
      }
    };
    Engine.prototype.getPlayerData = function () {
      return localStorage.getItem("xwilkinx_twp2_player");
    };
    Engine.prototype.clearPlayerData = function () {
      console.log("Clear player data");
      localStorage.clear();
    };
    Engine.STATE_BOOT = "BootState";
    Engine.STATE_PRELOADER = "PreloaderState";
    Engine.STATE_SPONSOR = "SponsorState";
    Engine.STATE_INTRO = "IntroState";
    Engine.STATE_MENU = "MenuState";
    Engine.STATE_GAME = "GameState";
    return Engine;
  })(Phaser.Game);
  TWP2.Engine = Engine;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var PlayerUtil = /** @class */ (function () {
    function PlayerUtil() {}
    PlayerUtil.Initialize = function () {
      PlayerUtil.SetDefault();
    };
    PlayerUtil.SetFromData = function (_data) {
      if (_data) {
        PlayerUtil.player = _data;
      }
    };
    PlayerUtil.ResetData = function () {
      PlayerUtil.SetDefault();
      TWP2.GameUtil.game.getMainMenu().refreshMenu();
      TWP2.GameUtil.game.savePlayerData();
      TWP2.SoundManager.UpdateAmbienceVolume();
      TWP2.SoundManager.UpdateMusicVolume();
    };
    PlayerUtil.ResetSkillPoints = function () {
      PlayerUtil.player.skills = PlayerUtil.GetDefaultSkills();
      PlayerUtil.player["skillPoints"] = PlayerUtil.MAX_RANK;
    };
    PlayerUtil.QuickCheat = function () {
      PlayerUtil.player["money"] = 1000000;
      PlayerUtil.player["level"] = PlayerUtil.MAX_RANK;
      PlayerUtil.player["skillPoints"] = PlayerUtil.MAX_RANK;
      var weapons = TWP2.WeaponDatabase.GetAllIds();
      var obj = {};
      for (var i = 0; i < weapons.length; i++) {
        PlayerUtil.player.weapons[weapons[i]] = {
          kills: 999,
          headshots: 999,
        };
      }
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.SetDefault = function () {
      this.player = {
        gameVersion: TWP2.GameUtil.GetVersionNumber(),
        name: "Justin",
        bNewPlayer: true,
        bPrestige: false,
        level: 1,
        xp: 0,
        skillPoints: 1,
        money: 0,
        lastGameModeId: null,
        lastLoadoutIndex: 0,
        lastLoadoutWeapon: 0,
        settings: PlayerUtil.GetDefaultSettingsData(),
        loadouts: PlayerUtil.GetDefaultLoadouts(),
        inventory: PlayerUtil.GetDefaultInventory(),
        weapons: PlayerUtil.GetWeapons(),
        skills: PlayerUtil.GetDefaultSkills(),
        achievements: [],
        bestScores: PlayerUtil.GetDefaultBestScores(),
        adDate: null,
        stats: {
          kills: 0,
          headshots: 0,
          shotsFired: 0,
          shotsHit: 0,
          games: 0,
        },
        newUnlocks: [],
        pendingItems: [],
      };
    };
    PlayerUtil.SetGameVolume = function (_val) {
      PlayerUtil.player.settings["gameVolume"] = _val;
      TWP2.SoundManager.UpdateAmbienceVolume();
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.SetMusicVolume = function (_val) {
      PlayerUtil.player.settings["musicVolume"] = _val;
      TWP2.SoundManager.UpdateMusicVolume();
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.GetCurrentRankId = function () {
      return "icon_rank_" + Math.ceil(PlayerUtil.player["level"] / 3);
    };
    PlayerUtil.GetRankIdFor = function (_val) {
      return "icon_rank_" + Math.ceil(_val / 3);
    };
    PlayerUtil.GetPlayerAccuracy = function () {
      var val = PlayerUtil.player.stats["shotsHit"] / PlayerUtil.player.stats["shotsFired"];
      if (isNaN(val)) {
        return 0;
      }
      return val;
    };
    PlayerUtil.GetControlsData = function () {
      return PlayerUtil.player.settings.controls;
    };
    PlayerUtil.ToggleSetting = function (_id, _button) {
      if (_button) {
        _button.toggleSelected();
        PlayerUtil.player.settings[_id] = _button.isSelected();
      }
    };
    PlayerUtil.GetDefaultSettingsData = function () {
      return {
        gameVolume: 1,
        musicVolume: 1,
        bEffects: true,
        bShells: true,
        bMags: true,
        controls: {
          reload: Phaser.Keyboard.R,
          interact: Phaser.Keyboard.E,
          switchWeapon: Phaser.Keyboard.Q,
          barrel: Phaser.Keyboard.F,
          action: Phaser.Keyboard.SPACEBAR,
        },
      };
    };
    PlayerUtil.GetDefaultSkills = function () {
      return {
        reload: 0,
        aim: 0,
        recoil: 0,
        xp: 0,
        money: 0,
      };
    };
    PlayerUtil.GetDefaultBestScores = function () {
      var obj = {};
      var modes = TWP2.GameModeDatabase.GetAllGameModes();
      for (var i = 0; i < modes.length; i++) {
        obj[modes[i]["id"]] = 0;
      }
      return obj;
    };
    PlayerUtil.GetDefaultLoadouts = function () {
      return [
        {
          id: 0,
          name: "Assault",
          primary: {
            id: TWP2.WeaponDatabase.WEAPON_MP5,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
          secondary: {
            id: TWP2.WeaponDatabase.WEAPON_M9,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
        },
        {
          id: 1,
          name: "Marksman",
          primary: {
            id: TWP2.WeaponDatabase.WEAPON_M16A4,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
          secondary: {
            id: TWP2.WeaponDatabase.WEAPON_M9,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
        },
        {
          id: 3,
          name: "Sniper",
          primary: {
            id: TWP2.WeaponDatabase.WEAPON_M40A3,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
          secondary: {
            id: TWP2.WeaponDatabase.WEAPON_M9,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
        },
        {
          id: 2,
          name: "Close Quarters",
          primary: {
            id: TWP2.WeaponDatabase.WEAPON_MOSSBERG,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
          secondary: {
            id: TWP2.WeaponDatabase.WEAPON_M9,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
        },
        {
          id: 4,
          name: "Heavy",
          primary: {
            id: TWP2.WeaponDatabase.WEAPON_MG4,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
          secondary: {
            id: TWP2.WeaponDatabase.WEAPON_M9,
            mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
          },
        },
      ];
    };
    PlayerUtil.GetWeapons = function () {
      var weapons = TWP2.WeaponDatabase.GetAllIds();
      var obj = {};
      for (var i = 0; i < weapons.length; i++) {
        obj[weapons[i]] = {
          kills: 0,
          headshots: 0,
        };
      }
      return obj;
    };
    PlayerUtil.AddNewLoadout = function () {
      var loadouts = PlayerUtil.player["loadouts"];
      var loadout = {
        id: loadouts.length,
        primary: {
          id: TWP2.WeaponDatabase.WEAPON_MP5,
          mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
        },
        secondary: {
          id: TWP2.WeaponDatabase.WEAPON_FIVESEVEN,
          mods: TWP2.WeaponDatabase.GetDefaultModsFor(null),
        },
      };
      PlayerUtil.player["loadouts"].push(loadout);
    };
    PlayerUtil.GetDefaultInventory = function () {
      var arr = [];
      var weapons = TWP2.WeaponDatabase.GetAllIds();
      for (var i = 0; i < weapons.length; i++) {
        arr.push({
          weaponId: weapons[i],
          mods: [],
        });
      }
      return arr;
    };
    PlayerUtil.IsMaxLevel = function () {
      return PlayerUtil.player.level >= PlayerUtil.MAX_RANK;
    };
    PlayerUtil.AddPrestige = function () {
      PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_PRESTIGE);
      PlayerUtil.player.bPrestige = true;
      PlayerUtil.player.xp = 0;
      PlayerUtil.player.level = 1;
      PlayerUtil.player.money = 0;
      PlayerUtil.player.loadouts = PlayerUtil.GetDefaultLoadouts();
      PlayerUtil.player.inventory = PlayerUtil.GetDefaultInventory();
      PlayerUtil.player.weapons = PlayerUtil.GetWeapons();
      PlayerUtil.player.skills = PlayerUtil.GetDefaultSkills();
      PlayerUtil.player.skillPoints = 1;
      TWP2.GameUtil.game.savePlayerData();
      TWP2.GameUtil.game.getMainMenu().getPlayMenu().setMenu(TWP2.PlayMenu.MENU_PROFILE);
      TWP2.GameUtil.game.getMainMenu().getPlayMenu().updateWidget();
      TWP2.SoundManager.PlayUISound("ui_prestige");
    };
    PlayerUtil.IsPrestiged = function () {
      return PlayerUtil.player["bPrestige"];
    };
    PlayerUtil.AddMoney = function (_val) {
      PlayerUtil.player["money"] += _val;
      var mainMenu = TWP2.GameUtil.game.getMainMenu();
      if (mainMenu) {
        var playMenu = mainMenu.getPlayMenu();
        if (playMenu) {
          mainMenu.getPlayMenu().updateWidget();
          mainMenu.getPlayMenu().refreshProfile();
        }
      }
    };
    PlayerUtil.GetMoneyRewardForLevel = function (_level) {
      return Math.min(500 + _level * 50, 3000);
    };
    PlayerUtil.GetKeyDescription = function (_id) {
      if (_id == PlayerUtil.CONTROL_RELOAD) {
        return "Reload";
      } else if (_id == PlayerUtil.CONTROL_SWITCH_WEAPON) {
        return "Switch weapon";
      } else if (_id == PlayerUtil.CONTROL_BARREL) {
        return "Use barrel attachment";
      } else if (_id == PlayerUtil.CONTROL_ACTION) {
        return "Create target (firing range)";
      }
      return "Unknown";
    };
    PlayerUtil.AddXP = function (_val) {
      var hud = TWP2.GameUtil.GetGameState() ? TWP2.GameUtil.GetGameState().getHUD() : null;
      var data = PlayerUtil.player;
      data["xp"] += _val;
      var xp = data["xp"];
      var nextXP = PlayerUtil.GetRequiredXPForRank(data["level"] + 1);
      if (data["level"] < PlayerUtil.MAX_RANK && xp >= nextXP) {
        data["level"]++;
        PlayerUtil.AddMoney(PlayerUtil.GetMoneyRewardForLevel(data["level"]));
        data["skillPoints"]++;
        //data["xp"] = PlayerUtil.GetRequiredXPForRank(data["rank"]);
        if (hud) {
          hud.addRankNotifier({
            type: "rank",
          });
        }
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        for (var i = 0; i < 10; i++) {
          var star = TWP2.GameUtil.GetGameState().createDebris(player.x, player.y, 0, TWP2.Debris.DEBRIS_STAR);
          if (star) {
            star.getBody().applyForce(TWP2.MathUtil.Random(-200, 200), -TWP2.MathUtil.Random(500, 1000));
          }
        }
        var newUnlocks = PlayerUtil.GetUnlocksForRank(data["level"]);
        for (var i = 0; i < newUnlocks.length; i++) {
          var cur = newUnlocks[i];
          PlayerUtil.AddNewUnlock(cur["type"], cur["id"]);
        }
        TWP2.SoundManager.PlayUISound("ui_level_up", 0.8);
      }
      if (hud) {
        hud.getPlayerInfo().updateForCurrentPlayer();
      }
      TWP2.SoundManager.PlayUISound("ui_point", 0.5);
    };
    PlayerUtil.GetXPPercent = function (_xp, _rank) {
      var current = _xp - this.GetRequiredXPForRank(_rank);
      var max = this.GetRequiredXPForRank(_rank + 1) - this.GetRequiredXPForRank(_rank);
      return current / max;
    };
    PlayerUtil.GetCurrentXPPercent = function () {
      if (PlayerUtil.player["level"] >= PlayerUtil.MAX_RANK) {
        return 1;
      }
      return PlayerUtil.GetXPPercent(PlayerUtil.player["xp"], PlayerUtil.player["level"]);
    };
    PlayerUtil.GetUnlocksForRank = function (_rank) {
      if (_rank <= 1) {
        return [];
      }
      var weapons = TWP2.WeaponDatabase.GetAllWeaponsByUnlockLevel(_rank);
      return weapons;
    };
    PlayerUtil.GetRequiredXPForRank = function (_rank) {
      if (_rank <= 1) {
        return 0;
      }
      return this.GetRequiredXPForRank(_rank - 1) + 10 * (_rank * 15);
    };
    PlayerUtil.HasAchievement = function (_id) {
      for (var i = 0; i < PlayerUtil.player["achievements"].length; i++) {
        if (PlayerUtil.player["achievements"][i] == _id) {
          return true;
        }
      }
      return false;
    };
    PlayerUtil.CheckExpert = function () {
      var arr = TWP2.GameModeDatabase.GetAllRankedGameModes();
      for (var i = 0; i < arr.length; i++) {
        if (TWP2.GameModeDatabase.GetStarsForGameMode(arr[i]["id"], PlayerUtil.player.bestScores[arr[i]["id"]]) < TWP2.GameModeDatabase.RANKED_STARS) {
          return;
        }
      }
      PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_EXPERT);
    };
    PlayerUtil.UnlockAchievement = function (_id) {
      var bUnlocked = PlayerUtil.HasAchievement(_id);
      if (!bUnlocked) {
        PlayerUtil.player["achievements"].push(_id);
        TWP2.GameUtil.game.pushAchievement(_id);
      }
      TWP2.GameUtil.game.savePlayerData();
      TWP2.APIUtil.UnlockAchievement(_id);
    };
    PlayerUtil.GetNumAchivementsUnlocked = function () {
      return PlayerUtil.player.achievements.length;
    };
    PlayerUtil.HasInventoryWeapon = function (_id) {
      var inventory = PlayerUtil.player["inventory"];
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i]["weaponId"] == _id) {
          return true;
        }
      }
      return false;
    };
    PlayerUtil.HasInventoryMod = function (_weaponId, _modId) {
      if (TWP2.WeaponDatabase.IsDefaultMod(_modId)) {
        return true;
      }
      var inventory = PlayerUtil.player["inventory"];
      var modType = TWP2.WeaponDatabase.GetMod(_modId)["type"];
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i]["weaponId"] == _weaponId) {
          for (var j = 0; j < inventory[i]["mods"].length; j++) {
            var curMod = inventory[i]["mods"][j];
          }
          if (inventory[i]["mods"].indexOf(_modId) >= 0) {
            return true;
          }
          break;
        }
      }
      return false;
    };
    PlayerUtil.UnlockAll = function () {
      PlayerUtil.player["inventory"] = TWP2.WeaponDatabase.GetAllIds();
    };
    PlayerUtil.AddWeaponToInventory = function (_weaponId) {
      PlayerUtil.player["inventory"].push({
        weaponId: _weaponId,
        mods: TWP2.WeaponDatabase.GetDefaultModsFor(_weaponId),
      });
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.AddModToInventory = function (_weaponId, _modId) {
      var inventory = PlayerUtil.player["inventory"];
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i]["weaponId"] == _weaponId) {
          var modData = TWP2.WeaponDatabase.GetMod(_modId);
          inventory[i]["mods"].push(_modId);
        }
      }
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.Buy = function (_cost) {
      PlayerUtil.player["money"] -= _cost;
      var mainMenu = TWP2.GameUtil.game.getMainMenu();
      if (mainMenu) {
        var playMenu = mainMenu.getPlayMenu();
        if (playMenu) {
          mainMenu.getPlayMenu().updateWidget();
        }
      }
      TWP2.SoundManager.PlayUISound("ui_purchase");
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.GetLoadoutItem = function (_loadoutIndex, _weaponIndex) {
      var loadout = PlayerUtil.player["loadouts"][_loadoutIndex];
      if (_weaponIndex == 0) {
        return loadout["primary"];
      } else if (_weaponIndex == 1) {
        return loadout["secondary"];
      }
      return null;
    };
    PlayerUtil.GetModUnlockPercent = function (_modId, _weaponId) {
      var mod = TWP2.WeaponDatabase.GetMod(_modId);
      if (mod) {
        if (mod["unlockKills"] != undefined) {
          return Math.min(PlayerUtil.player["weapons"][_weaponId]["kills"] / mod["unlockKills"], 1);
        } else if (mod["unlockHeadshots"] != undefined) {
          return Math.min(PlayerUtil.player["weapons"][_weaponId]["headshots"] / mod["unlockHeadshots"], 1);
        }
      }
      return 0;
    };
    PlayerUtil.GetModLockedStatus = function (_modId, _weaponId) {
      var mod = TWP2.WeaponDatabase.GetMod(_modId);
      if (mod) {
        if (mod["unlockKills"] != undefined) {
          if (PlayerUtil.player["weapons"][_weaponId]["kills"] < mod["unlockKills"]) {
            return true;
          }
        } else if (mod["unlockHeadshots"] != undefined) {
          if (PlayerUtil.player["weapons"][_weaponId]["headshots"] < mod["unlockHeadshots"]) {
            return true;
          }
        }
      }
      return false;
    };
    PlayerUtil.IsPendingItem = function (_id) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = 0; i < items.length; i++) {
          var cur = items[i];
          if (cur["id"] == _id) {
            return true;
          }
        }
      }
      return false;
    };
    PlayerUtil.ClearPendingModById = function (_modId, _weaponId) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = 0; i < items.length; i++) {
          var cur = items[i];
          if (cur["type"] == "mod") {
            if (cur["data"]["weaponId"] == _weaponId) {
              if (cur["id"] == _modId) {
                items.splice(i, 1);
              }
            }
          }
        }
      }
    };
    PlayerUtil.HasPendingMod = function (_id, _weaponId) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = 0; i < items.length; i++) {
          var cur = items[i];
          if (cur["type"] == "mod") {
            if (cur["data"]["weaponId"] == _weaponId) {
              var index = cur["id"].indexOf(_id);
              if (index >= 0) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };
    PlayerUtil.HasPendingModType = function (_weaponId, _modType) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = 0; i < items.length; i++) {
          var cur = items[i];
          if (cur["type"] == "mod") {
            if (cur["data"]["weaponId"] == _weaponId) {
              var mod = TWP2.WeaponDatabase.GetMod(cur["id"]);
              if (mod["type"] == _modType) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };
    PlayerUtil.HasPendingModsForWeapon = function (_weaponId) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = items.length - 1; i >= 0; i--) {
          var cur = items[i];
          if (cur["type"] == "mod") {
            if (cur["data"]["weaponId"] == _weaponId) {
              return true;
            }
          }
        }
      }
      return false;
    };
    PlayerUtil.HasPendingItemsForWeaponCategories = function (_categories) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = 0; i < items.length; i++) {
          var cur = items[i];
          if (cur["type"] == "weapon") {
            var wpn = TWP2.WeaponDatabase.GetWeapon(cur["id"]);
            for (var j = 0; j < _categories.length; j++) {
              if (wpn["type"] == _categories[j]) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };
    PlayerUtil.AddPendingItem = function (_data) {
      PlayerUtil.player["pendingItems"].push(_data);
    };
    PlayerUtil.ClearPendingItemById = function (_id) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = items.length - 1; i >= 0; i--) {
          var cur = items[i];
          if (cur["id"] == _id) {
            items.splice(i, 1);
          }
        }
        TWP2.GameUtil.game.savePlayerData();
      }
    };
    PlayerUtil.ClearPendingMods = function (_type, _weaponId) {
      if (PlayerUtil.IsPendingNewItems()) {
        var items = PlayerUtil.GetPendingItems();
        for (var i = items.length - 1; i >= 0; i--) {
          var cur = items[i];
          if (cur["type"] == "mod") {
            if (cur["data"]["weaponId"] == _weaponId) {
              var modData = TWP2.WeaponDatabase.GetMod(cur["id"]);
              if (cur["type"] == _type) {
                items.splice(i, 1);
              }
            }
          }
        }
        TWP2.GameUtil.game.savePlayerData();
      }
    };
    PlayerUtil.GetPendingItems = function () {
      return PlayerUtil.player["pendingItems"];
    };
    PlayerUtil.IsPendingNewItems = function () {
      if (!PlayerUtil.player["pendingItems"]) {
        return false;
      }
      return PlayerUtil.player["pendingItems"].length > 0;
    };
    PlayerUtil.HasSkillPoint = function () {
      return PlayerUtil.player["skillPoints"] > 0;
    };
    PlayerUtil.CanPrestige = function () {
      return PlayerUtil.player["level"] >= PlayerUtil.MAX_RANK && !PlayerUtil.IsPrestiged();
    };
    PlayerUtil.AddSkill = function (_id) {
      PlayerUtil.player.skills[_id]++;
      PlayerUtil.player.skillPoints--;
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.GetSkillValue = function (_id) {
      return PlayerUtil.player.skills[_id];
    };
    PlayerUtil.ClearPendingItems = function () {
      PlayerUtil.player["pendingItems"] = [];
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.AddNewUnlock = function (_type, _id, _data) {
      if (_data === void 0) {
        _data = null;
      }
      if (_data) {
        var newUnlocks = PlayerUtil.player["newUnlocks"];
        for (var i = 0; i < newUnlocks.length; i++) {
          if (newUnlocks[i]["data"]) {
            if (newUnlocks[i]["id"] == _id && newUnlocks[i]["data"]["weaponId"] == _data["weaponId"]) {
              return;
            }
          } else {
            if (newUnlocks[i]["id"] == _id) {
              return;
            }
          }
        }
      }
      PlayerUtil.player["newUnlocks"].push({ type: _type, id: _id, data: _data });
      PlayerUtil.AddPendingItem({ type: _type, id: _id, data: _data });
    };
    PlayerUtil.GetNewUnlocks = function () {
      return PlayerUtil.player["newUnlocks"];
    };
    PlayerUtil.HasNewUnlocks = function () {
      return PlayerUtil.player["newUnlocks"].length > 0;
    };
    PlayerUtil.ClearNewUnlocks = function () {
      PlayerUtil.player["newUnlocks"] = [];
      TWP2.GameUtil.game.savePlayerData();
    };
    PlayerUtil.GetFavouriteWeapon = function () {
      var cur = null;
      var max = 0;
      var weapons = PlayerUtil.player["weapons"];
      for (var id in weapons) {
        var obj = weapons[id];
        if (obj["kills"] > max) {
          cur = id;
          max = obj["kills"];
        }
      }
      return cur;
    };
    PlayerUtil.MAX_RANK = 50;
    PlayerUtil.MAX_SKILLS = 10;
    PlayerUtil.CONTROL_UP = "up";
    PlayerUtil.CONTROL_DOWN = "down";
    PlayerUtil.CONTROL_LEFT = "left";
    PlayerUtil.CONTROL_RIGHT = "right";
    PlayerUtil.CONTROL_RELOAD = "reload";
    PlayerUtil.CONTROL_SWITCH_WEAPON = "switchWeapon";
    PlayerUtil.CONTROL_ACTION = "action";
    PlayerUtil.CONTROL_BARREL = "barrel";
    return PlayerUtil;
  })();
  TWP2.PlayerUtil = PlayerUtil;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var GameUtil = /** @class */ (function () {
    function GameUtil() {}
    GameUtil.GetVersionNumber = function () {
      return "v1.3 " + TWP2.APIUtil.GetCurrentAPIId();
    };
    GameUtil.IsDebugging = function () {
      return GameUtil.IsLocalHost();
    };
    GameUtil.IsLocalHost = function () {
      return location.hostname == "localhost" || location.hostname == "127.0.0.1";
    };
    GameUtil.CloneObject = function (_data) {
      return JSON.parse(JSON.stringify(_data));
    };
    GameUtil.SetTextShadow = function (_text) {
      _text.setShadow(1.5, 1.5, "rgba(0,0,0,0.25)", 0);
    };
    GameUtil.CreateTree = function (_items) {
      var gfx = GameUtil.game.add.graphics();
      gfx.lineStyle(1, 0xffffff, 0.2);
      var startX = 0;
      for (var i = 0; i < _items.length; i++) {
        var item = _items[i];
        if (i == 0) {
          startX = item.x + 10;
          gfx.moveTo(startX, item.y + item.height);
        } else {
          item.x = startX + 20;
          gfx.lineTo(startX, item.y + item.height * 0.5);
          gfx.lineTo(startX + 10, item.y + item.height * 0.5);
          gfx.moveTo(startX, item.y + item.height * 0.5);
        }
      }
      return gfx;
    };
    GameUtil.CreateSpinner = function () {
      var spinner = this.game.add.group();
      var circle = this.game.add.graphics();
      circle.lineStyle(2, 0xffffff, 0.2);
      circle.drawCircle(0, 0, 24);
      spinner.add(circle);
      var section = this.game.add.graphics();
      section.lineStyle(2, 0xffffff, 1);
      section.arc(0, 0, 12, 0, 60 * MathUtil.TO_RADIANS, false);
      spinner.add(section);
      var tween = this.game.add.tween(section).to({ rotation: MathUtil.ToRad(360) }, 600, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
      return spinner;
    };
    GameUtil.CreateSocialGroup = function () {
      var socialGroup = this.game.add.group();
      var copyText = this.game.add.text(0, 0, "\u00A9 2019 Wilkin Games", { font: "14px " + FontUtil.FONT, fill: "#FFFFFF" });
      copyText.alpha = 0.5;
      socialGroup.add(copyText);
      var wilkinButton = new TWP2.ImageButton("atlas_ui", "social_xwilkinx");
      wilkinButton.setCallback(GameUtil.OpenWilkinHomepage, GameUtil);
      wilkinButton.x = socialGroup.width + 10;
      socialGroup.add(wilkinButton);
      var downloadButton = new TWP2.ImageButton("atlas_ui", "icon_download_small");
      downloadButton.setCallback(GameUtil.OpenTWP2Download, GameUtil);
      downloadButton.x = socialGroup.width + 2;
      socialGroup.add(downloadButton);
      var fbButton = new TWP2.ImageButton("atlas_ui", "social_facebook");
      fbButton.setCallback(GameUtil.OpenWilkinFacebook, GameUtil);
      fbButton.x = socialGroup.width + 2;
      socialGroup.add(fbButton);
      var youtubeButton = new TWP2.ImageButton("atlas_ui", "social_youtube");
      youtubeButton.setCallback(GameUtil.OpenWilkinYoutube, GameUtil);
      youtubeButton.x = socialGroup.width + 2;
      socialGroup.add(youtubeButton);
      copyText.y = socialGroup.height * 0.5 - copyText.height * 0.5 + 3;
      return socialGroup;
    };
    GameUtil.OpenAGHomepage = function () {
      window.open("https://armor.ag/MoreGames", "_blank");
    };
    GameUtil.OpenAGFacebook = function () {
      window.open("https://facebook.com/ArmorGames", "_blank");
    };
    GameUtil.OpenWilkinHomepage = function () {
      window.open("https://xwilkinx.com", "_blank");
    };
    GameUtil.OpenDeadswitch3 = function () {
      window.open("https://xwilkinx.com/deadswitch-3?twp2=1", "_blank");
    };
    GameUtil.OpenWilkinAG = function () {
      window.open("https://armorgames.com/author/xWILKINx", "_blank");
    };
    GameUtil.OpenWilkinFacebook = function () {
      window.open("https://facebook.com/xwilkinx", "_blank");
    };
    GameUtil.OpenWilkinYoutube = function () {
      window.open("https://youtube.com/channel/UChk6XyAUFGtECyOOpEBnpiA", "_blank");
    };
    GameUtil.OpenTWP2Download = function () {
      window.open("https://xwilkinx.com/tactical-weapon-pack-2", "_blank");
    };
    GameUtil.OpenTWPDownload = function () {
      if (TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_ARMOR_GAMES || GameUtil.IsDebugging()) {
        window.open("https://armorgames.com/tactical-weapon-pack-game/18521", "_blank");
      } else {
        window.open("https://xwilkinx.com/tactical-weapon-pack", "_blank");
      }
    };
    GameUtil.OpenAWPDownload = function () {
      window.open("https://xwilkinx.com/adversity-weapon-pack", "_blank");
    };
    GameUtil.GetKeySize = function (_id) {
      if (_id == Phaser.Keyboard.SPACEBAR) {
        return 100;
      }
      if (_id == Phaser.Keyboard.CONTROL || _id == Phaser.Keyboard.SHIFT || _id == Phaser.Keyboard.ALT || _id == Phaser.Keyboard.TAB || _id == Phaser.Keyboard.ENTER) {
        return 64;
      }
      return 32;
    };
    GameUtil.SortUnlocks = function (_a, _b) {
      if (_a["type"] < _b["type"]) {
        return -1;
      } else if (_a["type"] > _b["type"]) {
        return 1;
      }
      return 0;
    };
    GameUtil.GetKeyStringFromId = function (_id) {
      var keyCode = _id;
      if (keyCode == Phaser.KeyCode.LEFT) {
        return "Left";
      } else if (keyCode == Phaser.KeyCode.RIGHT) {
        return "Right";
      } else if (keyCode == Phaser.KeyCode.UP) {
        return "Up";
      } else if (keyCode == Phaser.KeyCode.DOWN) {
        return "Down";
      } else if (keyCode == Phaser.KeyCode.SHIFT) {
        return "Shift";
      } else if (keyCode == Phaser.KeyCode.CONTROL) {
        return "Ctrl";
      } else if (keyCode == Phaser.KeyCode.SPACEBAR) {
        return "Space";
      } else if (keyCode == Phaser.KeyCode.TAB) {
        return "Tab";
      } else if (keyCode == Phaser.KeyCode.ENTER) {
        return "Enter";
      } else if (keyCode == Phaser.KeyCode.ALT) {
        return "Alt";
      } else if (keyCode == Phaser.KeyCode.ESC) {
        return "Esc";
      }
      return String.fromCharCode(keyCode);
    };
    GameUtil.ConvertToNumeral = function (_val) {
      if (!+_val) return "?";
      var digits = String(+_val).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
      while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
      return Array(+digits.join("") + 1).join("M") + roman;
    };
    GameUtil.ConvertToTimeString = function (_seconds, _bAddMilliSeconds) {
      if (_bAddMilliSeconds === void 0) {
        _bAddMilliSeconds = false;
      }
      _seconds = Math.ceil(_seconds);
      var s = _seconds % 60;
      var ms = (_seconds % 1) * 100;
      var m = Math.floor((_seconds % 3600) / 60);
      var h = Math.floor(_seconds / (60 * 60));
      var hourStr = h == 0 ? "" : doubleDigitFormat(h) + ":";
      var minuteStr = doubleDigitFormat(m) + ":";
      var secondsStr = doubleDigitFormat(s);
      var msStr = doubleDigitFormat(ms);
      function doubleDigitFormat(_num) {
        if (_num < 10) {
          return "0" + _num;
        }
        return String(_num);
      }
      return hourStr + minuteStr + secondsStr + (_bAddMilliSeconds ? "." + msStr : "");
    };
    GameUtil.OnOverSetText = function (_arg1, _arg2, _text, _val) {
      _text.setText(_val, true);
    };
    GameUtil.OnOutClearText = function (_arg1, _arg2, _text) {
      _text.setText("", true);
    };
    GameUtil.GetPreloaderState = function () {
      if (!GameUtil.game) {
        return null;
      }
      var state = GameUtil.game.state.getCurrentState();
      return state instanceof TWP2.State_Preloader ? state : null;
    };
    GameUtil.GetGameState = function () {
      if (!GameUtil.game) {
        return null;
      }
      var state = GameUtil.game.state.getCurrentState();
      return state instanceof TWP2.State_Game ? state : null;
    };
    GameUtil.AdsEnabled = function () {
      if (!GameUtil.game.ads && !GameUtil.game.cpmstarAPI) {
        return false;
      }
      return TWP2.APIUtil.AdsAreAllowed(); // && !GameUtil.IsLocalHost();
    };
    GameUtil.ShouldUseCPMStarAds = function () {
      return TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_ARMOR_GAMES || TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_NEWGROUNDS;
    };
    GameUtil.GetRandomTip = function () {
      var tips = this.game.cache.getJSON("json_tips");
      var arr = tips["generic"];
      return "Tip: " + arr[MathUtil.Random(0, arr.length - 1)];
    };
    GameUtil.CheckPlural = function (_val) {
      if (_val == 1) {
        return "";
      }
      return "s";
    };
    GameUtil.ForceStartAudio = function () {
      console.log("Force starting audio...");
      if (GameUtil.game) {
        try {
          GameUtil.game.sound.context.resume();
        } catch (error) {
          console.error(error);
        }
      }
    };
    GameUtil.ApplyForce = function (_body, _vx, _vy) {
      if (!_body) {
        alert("GameUtil::ApplyForce --> null body!");
        return;
      }
      if (isNaN(_vx) || isNaN(_vy)) {
        alert("GameUtil::ApplyForce --> vx or vy is not a number: " + _vx + ", " + _vy + "\n" + _body.sprite);
        return;
      }
      if (!(_vx == _vx)) {
        alert("GameUtil::ApplyForce --> _vx != _vx");
        return;
      }
      if (!(_vy == _vy)) {
        alert("GameUtil::ApplyForce --> _vy != _vy");
        return;
      }
      _body.applyForce(_vx, _vy);
    };
    GameUtil.FilterRaycastHit = function (body, fixture, point, normal) {
      var filterData = fixture.GetFilterData();
      if (filterData.categoryBits == TWP2.State_Game.CATEGORY_OBJECTS) {
        return true;
      }
      if (filterData.categoryBits == TWP2.State_Game.CATEGORY_WALLS) {
        return true;
      }
      return false;
    };
    GameUtil.FormatNum = function (_num) {
      if (isNaN(_num)) {
        return "";
      }
      return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    GameUtil.CreateWeapon = function (_data) {
      var id = _data["id"];
      var weapon = TWP2.WeaponDatabase.GetWeapon(id);
      if (weapon) {
        var padding = 2;
        var group = GameUtil.game.add.group();
        group.name = id;
        var basePoint = weapon["points"]["base"];
        if (basePoint) {
          var base = GameUtil.game.add.image(basePoint.x, basePoint.y, "atlas_" + id, TWP2.WeaponDatabase.BASE_DEFAULT);
          base.name = "base";
          base.x = Math.round(base.x - base.width * 0.5);
          base.y = Math.round(base.y - base.height * 0.5);
          group.add(base);
        }
        var opticPoint = weapon["points"]["optic"];
        if (opticPoint) {
          var optic = GameUtil.game.add.image(opticPoint.x, opticPoint.y + padding, "atlas_" + id, _data["optic"] ? _data["optic"] : TWP2.WeaponDatabase.OPTIC_DEFAULT);
          optic.name = "optic";
          optic.x = Math.round(optic.x - optic.width * 0.5);
          optic.y = Math.round(optic.y - optic.height);
          if (opticPoint["bBack"] == true) {
            group.addAt(optic, 0);
          } else {
            group.add(optic);
          }
        }
        var magPoint = weapon["points"]["mag"];
        if (magPoint) {
          var mag = GameUtil.game.add.image(magPoint.x, magPoint.y, "atlas_" + id, TWP2.WeaponDatabase.MAG_DEFAULT);
          mag.name = "mag";
          mag.x = Math.round(mag.x - mag.width * 0.5);
          mag.y = Math.round(mag.y - mag.height * 0.5);
          if (magPoint["bFront"] == true) {
            group.add(mag);
          } else {
            group.addAt(mag, 0);
          }
        }
        var pumpPoint = weapon["points"]["pump"];
        if (pumpPoint) {
          var pump = GameUtil.game.add.image(pumpPoint.x, pumpPoint.y, "atlas_" + id, TWP2.WeaponDatabase.PUMP_DEFAULT);
          pump.name = "pump";
          pump.x = Math.round(pump.x - pump.width * 0.5);
          pump.y = Math.round(pump.y - pump.height * 0.5);
          group.add(pump);
        }
        var slidePoint = weapon["points"]["slide"];
        if (slidePoint) {
          var slide = GameUtil.game.add.image(slidePoint.x, slidePoint.y, "atlas_" + id, TWP2.WeaponDatabase.SLIDE_DEFAULT);
          slide.name = "slide";
          slide.x = Math.round(slide.x - slide.width * 0.5);
          slide.y = Math.round(slide.y - slide.height * 0.5);
          group.add(slide);
        }
        var muzzlePoint = weapon["points"]["muzzle"];
        if (muzzlePoint) {
          var muzzle = GameUtil.game.add.image(0, 0, "atlas_mods", TWP2.WeaponDatabase.MUZZLE_DEFAULT);
          muzzle.name = TWP2.WeaponDatabase.MOD_MUZZLE;
          muzzle.anchor.set(0, 0.5);
          muzzle.x = Math.floor(muzzlePoint.x);
          muzzle.y = muzzlePoint.y;
          if (muzzlePoint["bBack"] == true) {
            group.addAt(muzzle, 0);
          } else {
            group.add(muzzle);
          }
          if (_data["muzzleMod"] == TWP2.WeaponDatabase.MUZZLE_DEFAULT || !_data["muzzleMod"]) {
            muzzle.visible = false;
          } else {
            muzzle.frameName = _data["muzzleMod"];
          }
        }
        var bSmallM203 = weapon["bSmallM203"];
        var masterkeyPoint = weapon["points"]["m203"];
        if (masterkeyPoint) {
          var barrel = GameUtil.game.add.image(0, 0, "atlas_mods", bSmallM203 ? TWP2.WeaponDatabase.BARREL_MASTERKEY_SMALL : TWP2.WeaponDatabase.BARREL_MASTERKEY);
          barrel.name = TWP2.WeaponDatabase.BARREL_MASTERKEY;
          barrel.x = Math.round(masterkeyPoint.x);
          barrel.y = Math.round(masterkeyPoint.y);
          group.add(barrel);
          if (_data["barrel"] != TWP2.WeaponDatabase.BARREL_MASTERKEY) {
            barrel.visible = false;
          }
        }
        var m203Point = weapon["points"]["m203"];
        if (m203Point) {
          var barrel = GameUtil.game.add.image(0, 0, "atlas_mods", bSmallM203 ? TWP2.WeaponDatabase.BARREL_M203_SMALL : TWP2.WeaponDatabase.BARREL_M203);
          barrel.name = TWP2.WeaponDatabase.BARREL_M203;
          barrel.x = Math.round(m203Point.x);
          barrel.y = Math.round(m203Point.y);
          group.add(barrel);
          if (_data["barrel"] != TWP2.WeaponDatabase.BARREL_M203) {
            barrel.visible = false;
          }
        }
        var laserPoint = weapon["points"]["laser"];
        if (laserPoint) {
          var laserId = weapon["bSmallLaser"] ? TWP2.WeaponDatabase.BARREL_LASER_SMALL : TWP2.WeaponDatabase.BARREL_LASER;
          var barrel = GameUtil.game.add.image(0, 0, "atlas_mods", laserId);
          barrel.name = TWP2.WeaponDatabase.BARREL_LASER;
          barrel.x = Math.round(laserPoint.x);
          barrel.y = Math.round(laserPoint.y);
          if (laserPoint["bBack"] == true) {
            group.addAt(barrel, 0);
          } else {
            group.add(barrel);
          }
          if (_data["barrel"] != TWP2.WeaponDatabase.BARREL_LASER) {
            barrel.visible = false;
          }
        }
        var gripPoint = weapon["points"]["grip"];
        if (!gripPoint) {
          gripPoint = weapon["points"]["m203"];
        }
        if (gripPoint) {
          var gripId = weapon["bSmallGrip"] ? TWP2.WeaponDatabase.BARREL_GRIP_SMALL : TWP2.WeaponDatabase.BARREL_GRIP;
          var grip = GameUtil.game.add.image(0, 0, "atlas_mods", gripId);
          grip.name = TWP2.WeaponDatabase.BARREL_GRIP;
          grip.x = Math.round(gripPoint.x) + (weapon["points"]["m203"] ? 20 : 0);
          grip.y = Math.round(gripPoint.y) - (weapon["points"]["m203"] ? 1 : 0);
          if (!weapon["bSmallGrip"]) {
            grip.y -= 1;
          }
          var gripContainer = group;
          if (group.getByName("pump")) {
            gripContainer = group.getByName("pump");
          }
          if (gripPoint["bBack"] == true) {
            gripContainer.addChildAt(grip, 0);
          } else {
            gripContainer.addChild(grip);
          }
          if (_data["barrel"] != TWP2.WeaponDatabase.BARREL_GRIP) {
            grip.visible = false;
          }
        }
        var bipodPoint = weapon["points"]["bipod"];
        if (bipodPoint) {
          var bipodId = TWP2.WeaponDatabase.BARREL_BIPOD;
          var bipod = GameUtil.game.add.image(0, 0, "atlas_mods", bipodId);
          bipod.name = TWP2.WeaponDatabase.BARREL_BIPOD;
          bipod.x = Math.round(bipodPoint.x);
          bipod.y = Math.round(bipodPoint.y);
          if (bipodPoint["bBack"] == true) {
            group.addChildAt(bipod, 0);
          } else {
            group.addChild(bipod);
          }
          if (_data["barrel"] != TWP2.WeaponDatabase.BARREL_BIPOD) {
            bipod.visible = false;
          }
        }
        for (var i = 0; i < group.length; i++) {
          var item = group.getAt(i);
          item.x += base.width * 0.5;
          item.y += base.height * 0.5 + (optic != null ? optic.height * 0.5 : 0);
        }
        var texture = group.generateTexture();
        return group;
      }
      return null;
    };
    GameUtil.RECT_RADIUS = 5;
    GameUtil.CPMSTAR_CODE = "41ZD0803B12";
    return GameUtil;
  })();
  TWP2.GameUtil = GameUtil;
  var SoundManager = /** @class */ (function () {
    function SoundManager() {}
    SoundManager.SetMute = function (_bVal) {
      SoundManager.bMute = _bVal;
      if (GameUtil.game) {
        GameUtil.game.sound.mute = _bVal;
      }
      if (!SoundManager.bMute) {
        if (SoundManager.CurrentMusic) {
          SoundManager.UpdateMusicVolume();
        }
      }
    };
    SoundManager.IsMuted = function () {
      return SoundManager.bMute;
    };
    SoundManager.PlayMusic = function (_id) {
      if (SoundManager.CurrentMusic) {
        SoundManager.CurrentMusic.stop();
        SoundManager.CurrentMusic = null;
      }
      if (_id) {
        var sfx = GameUtil.game.add.audio(_id);
        sfx.loop = true;
        SoundManager.CurrentMusic = sfx;
        SoundManager.CurrentMusic.play();
        SoundManager.UpdateMusicVolume();
      }
    };
    SoundManager.UpdateMusicVolume = function () {
      if (SoundManager.CurrentMusic) {
        var desiredVolume = TWP2.PlayerUtil.player.settings["musicVolume"];
        if (SoundManager.bMute) {
          desiredVolume = 0;
        }
        SoundManager.CurrentMusic.volume = desiredVolume;
      }
    };
    SoundManager.PlayAmbience = function (_id) {
      if (SoundManager.CurrentAmbience) {
        SoundManager.CurrentAmbience.stop();
        SoundManager.CurrentAmbience = null;
      }
      var sfx = GameUtil.game.add.audio(_id);
      sfx.loop = true;
      SoundManager.CurrentAmbience = sfx;
      SoundManager.CurrentAmbience.play();
      SoundManager.UpdateAmbienceVolume();
    };
    SoundManager.UpdateAmbienceVolume = function () {
      if (SoundManager.CurrentAmbience) {
        var desiredVolume = TWP2.PlayerUtil.player.settings["gameVolume"] * 0.75;
        if (GameUtil.GetGameState()) {
          if (GameUtil.GetGameState().isPaused()) {
            desiredVolume = 0;
          }
        }
        if (SoundManager.bMute) {
          desiredVolume = 0;
        }
        SoundManager.CurrentAmbience.volume = desiredVolume;
      }
    };
    SoundManager.DestroyAmbience = function () {
      if (SoundManager.CurrentAmbience) {
        SoundManager.CurrentAmbience.stop();
        SoundManager.CurrentAmbience.destroy();
        SoundManager.CurrentAmbience = null;
      }
    };
    SoundManager.PlaySound = function (_id) {
      if (SoundManager.bMute) {
        return null;
      }
      var sfx = GameUtil.game.add.audio(_id);
      if (sfx) {
        sfx.play();
      }
      return sfx;
    };
    SoundManager.PlayUISound = function (_id, _volumeMultiplier) {
      if (_volumeMultiplier === void 0) {
        _volumeMultiplier = 1;
      }
      if (SoundManager.bMute) {
        return null;
      }
      var desiredVolume = _volumeMultiplier * TWP2.PlayerUtil.player.settings["gameVolume"];
      if (desiredVolume > 0) {
        var sfx = GameUtil.game.add.audio(_id);
        sfx.volume = desiredVolume;
        sfx.play();
        return sfx;
      }
      return null;
    };
    SoundManager.PlayWorldSound = function (_id, _x, _y, _randomMax, _volumeMultiplier, _bLoop) {
      if (_randomMax === void 0) {
        _randomMax = 0;
      }
      if (_volumeMultiplier === void 0) {
        _volumeMultiplier = 1;
      }
      if (_bLoop === void 0) {
        _bLoop = false;
      }
      var desiredVolume = SoundManager.GetVolForWorldPosition(_x, _y) * _volumeMultiplier * TWP2.PlayerUtil.player.settings["gameVolume"];
      if (SoundManager.bMute) {
        desiredVolume = 0;
      }
      var soundId = _id;
      if (_randomMax > 0) {
        soundId += "_" + MathUtil.Random(1, _randomMax).toString();
      }
      var sfx = GameUtil.game.add.audio(soundId);
      if (sfx) {
        var sound = sfx instanceof Phaser.Sound ? sfx : null;
        sound.loop = _bLoop;
        sfx.volume = desiredVolume;
        sfx.play();
        if (sfx._sound) {
          try {
            var bRandomize = soundId.indexOf("wpn") >= 0 || soundId.indexOf("physics") >= 0 || soundId.indexOf("explosion") >= 0;
            if (bRandomize) {
              var randMax = 120;
              if (soundId.indexOf("wpn_fire") >= 0) {
                randMax = 140;
              } else if (soundId.indexOf("wpn_bolt") >= 0) {
                randMax = 110;
              }
              sfx._sound.playbackRate.value = MathUtil.Random(100, randMax) * 0.01;
            }
          } catch (e) {
            console.log(e);
          }
        }
        if (sound && !sound.loop) {
          if (SoundManager.sounds.length > SoundManager.MAX_SOUNDS) {
            SoundManager.DestroySound(SoundManager.sounds[0], 0);
          }
          sound.onStop.addOnce(SoundManager.DestroySound, SoundManager, 0, [sound]);
          SoundManager.sounds.push(sound);
        }
      }
      return sfx;
    };
    SoundManager.GetVolForWorldPosition = function (_x, _y) {
      var stageWidthMid = GameUtil.game.scale.width * 0.5;
      var stageHeightMid = GameUtil.game.scale.height * 0.5;
      var global = new Phaser.Point(_x, _y);
      global.x -= GameUtil.game.camera.x;
      global.y -= GameUtil.game.camera.y;
      var dist = MathUtil.Dist(global.x, global.y, stageWidthMid, stageHeightMid);
      var volume = 1 - dist * 0.0007;
      return Math.min(Math.max(0, volume), 1);
    };
    SoundManager.DestroySound = function (_sfx, _index) {
      if (_index === void 0) {
        _index = -1;
      }
      try {
        if (_sfx) {
          var index = _index >= 0 ? _index : SoundManager.sounds.indexOf(_sfx);
          if (index >= 0) {
            SoundManager.sounds.splice(0, 1);
          } else {
            console.error("Sound not in array: " + _sfx.name);
          }
          _sfx.onStop.removeAll(SoundManager);
          _sfx.stop();
          _sfx.destroy();
        }
      } catch (e) {
        console.error(e);
      }
    };
    SoundManager.MAX_SOUNDS = 1000;
    SoundManager.sounds = [];
    SoundManager.bMute = false;
    return SoundManager;
  })();
  TWP2.SoundManager = SoundManager;
  var FontUtil = /** @class */ (function () {
    function FontUtil() {}
    FontUtil.FONT = "Share Tech";
    FontUtil.FONT_HUD = "PT Mono";
    return FontUtil;
  })();
  TWP2.FontUtil = FontUtil;
  var ColourUtil = /** @class */ (function () {
    function ColourUtil() {}
    ColourUtil.GetHealthColours = function () {
      return [ColourUtil.COLOUR_RED, 0xffa954, ColourUtil.COLOUR_GREEN];
    };
    ColourUtil.COLOUR_BUTTONS = 0x6699cc;
    ColourUtil.COLOUR_XP = 0xffd76d;
    ColourUtil.COLOUR_XP_STRING = "#FFD76D";
    ColourUtil.COLOUR_MONEY = 0x5fbfff;
    ColourUtil.COLOUR_MONEY_STRING = "#5FBFFF";
    ColourUtil.COLOUR_SKILL = 0xff9a5f;
    ColourUtil.COLOUR_SKILL_STRING = "#FF9A5F";
    ColourUtil.COLOUR_GREEN = 0x5fff7f;
    ColourUtil.COLOUR_GREEN_STRING = "#5FFF7F";
    ColourUtil.COLOUR_RED = 0xff5f5f;
    ColourUtil.COLOUR_RED_STRING = "#FF5F5F";
    return ColourUtil;
  })();
  TWP2.ColourUtil = ColourUtil;
  var MathUtil = /** @class */ (function () {
    function MathUtil() {}
    MathUtil.Random = function (_min, _max) {
      return GameUtil.game.rnd.between(_min, _max);
    };
    MathUtil.RandomBoolean = function () {
      return Math.random() > 0.5;
    };
    MathUtil.RandomAngle = function () {
      return MathUtil.Random(0, 360) * MathUtil.TO_RADIANS;
    };
    MathUtil.Dist = function (_x1, _y1, _x2, _y2) {
      return Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
    };
    MathUtil.Angle = function (_x1, _y1, _x2, _y2) {
      var distX = _x2 - _x1;
      var distY = _y2 - _y1;
      return Math.atan2(distY, distX);
    };
    MathUtil.ToRad = function (_degrees) {
      return _degrees * MathUtil.TO_RADIANS;
    };
    MathUtil.TO_RADIANS = Math.PI / 180;
    MathUtil.TO_DEGREES = 180 / Math.PI;
    return MathUtil;
  })();
  TWP2.MathUtil = MathUtil;
  var DamageType = /** @class */ (function () {
    function DamageType() {}
    DamageType.DAMAGE_TYPE_BULLET = "DAMAGE_TYPE_BULLET";
    DamageType.DAMAGE_TYPE_EXPLOSIVE = "DAMAGE_TYPE_EXPLOSIVE";
    DamageType.DAMAGE_TYPE_WORLD = "DAMAGE_TYPE_WORLD";
    return DamageType;
  })();
  TWP2.DamageType = DamageType;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var Controller = /** @class */ (function () {
    function Controller() {}
    Controller.prototype.destroy = function () {
      this.pawn = null;
      this.character = null;
    };
    Controller.prototype.tick = function () {
      return;
    };
    Controller.prototype.possess = function (_pawn) {
      if (this.pawn) {
        this.unPossess();
      }
      this.pawn = _pawn;
      this.character = _pawn instanceof TWP2.Character ? this.pawn : null;
      this.pawn.onPossess(this);
    };
    Controller.prototype.unPossess = function () {
      this.pawn = null;
    };
    Controller.prototype.onPawnTakeDamage = function (_damageAmount, _causer) {
      return;
    };
    Controller.prototype.onPawnDeath = function (_instigator, _causer, _damageType, _bHeadshot) {
      return;
    };
    Controller.prototype.onPawnKill = function (_killed, _causer, _damageType, _bHeadshot) {
      return;
    };
    Controller.prototype.onPawnSetTeam = function (_team) {
      return;
    };
    Controller.prototype.onEnemyHit = function () {
      return;
    };
    Controller.prototype.getPawn = function () {
      return this.pawn;
    };
    return Controller;
  })();
  TWP2.Controller = Controller;
  var PlayerController = /** @class */ (function (_super) {
    __extends(PlayerController, _super);
    function PlayerController() {
      var _this = _super.call(this) || this;
      _this.bInputEnabled = true;
      _this.bKeySwitchWeapon = true;
      _this.bKeyAction = true;
      _this.bKeyBarrel = true;
      _this.hud = new TWP2.HUD();
      TWP2.GameUtil.game.input.onDown.add(_this.onMouseDown, _this);
      TWP2.GameUtil.game.input.onUp.add(_this.onMouseUp, _this);
      return _this;
    }
    PlayerController.prototype.destroy = function () {
      TWP2.GameUtil.game.input.onDown.remove(this.onMouseDown, this);
      TWP2.GameUtil.game.input.onUp.remove(this.onMouseUp, this);
      this.hud.destroy();
      this.hud = null;
      _super.prototype.destroy.call(this);
    };
    PlayerController.prototype.tick = function () {
      this.hud.tick();
      _super.prototype.tick.call(this);
      if (this.canInput()) {
        var keyboard = TWP2.GameUtil.game.input.keyboard;
        var mouseX = TWP2.GameUtil.game.input.activePointer.worldX;
        var mouseY = TWP2.GameUtil.game.input.activePointer.worldY;
        mouseX /= TWP2.GameUtil.game.world.scale.x;
        mouseY /= TWP2.GameUtil.game.world.scale.y;
        if (this.pawn) {
          if (!TWP2.GameUtil.GetGameState().getGameMode().matchHasEnded()) {
            this.pawn.lookAt(mouseX, mouseY);
            if (keyboard.addKey(Phaser.Keyboard.ONE).isDown) {
              this.character.selectWeapon(0);
            }
            if (keyboard.addKey(Phaser.Keyboard.TWO).isDown) {
              this.character.selectWeapon(1);
            }
            if (keyboard.addKey(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_RELOAD]).isDown) {
              this.character.reload();
            }
            if (keyboard.addKey(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_SWITCH_WEAPON]).isDown) {
              if (this.bKeySwitchWeapon) {
                this.bKeySwitchWeapon = false;
                this.character.switchWeapon();
              }
            } else {
              this.bKeySwitchWeapon = true;
            }
            if (keyboard.addKey(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_ACTION]).isDown) {
              if (this.bKeyAction) {
                this.bKeyAction = false;
                if (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.GameMode_Range) {
                  var range = TWP2.GameUtil.GetGameState().getGameMode();
                  var currentTarget = range.getCurrentTarget();
                  var target = TWP2.GameUtil.GetGameState().createTarget(mouseX, Math.min(mouseY, TWP2.GameUtil.game.world.height - 150), currentTarget[1], currentTarget[0]);
                  TWP2.SoundManager.PlayWorldSound("physics_body_fall", target.x, target.y, 0, 0.2);
                } else {
                  if (TWP2.GameUtil.IsDebugging()) {
                    TWP2.GameUtil.GetGameState().getGameMode().endMatch();
                  }
                  //GameUtil.GetGameState().getGameMode().toggleMatrixMode();
                }
              }
            } else {
              this.bKeyAction = true;
            }
            if (keyboard.addKey(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_BARREL]).isDown) {
              if (this.bKeyBarrel) {
                this.bKeyBarrel = false;
                this.character.triggerBarrel();
              }
            } else {
              this.bKeyBarrel = true;
            }
          } else {
            this.pawn.lookAt(this.pawn.x + 100, this.pawn.y);
          }
        }
      }
    };
    PlayerController.prototype.onPawnKill = function (_killed, _causer, _damageType, _bHeadshot) {
      _super.prototype.onPawnKill.call(this, _killed, _causer, _damageType, _bHeadshot);
      var projectile = _causer instanceof TWP2.ProjectileBase ? _causer : null;
      if (projectile) {
        if (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.RankedGameMode) {
          var weapon = projectile.getData()["weapon"];
          if (weapon) {
            var arr;
            if (!TWP2.PlayerUtil.player["weapons"][weapon["id"]]["kills"]) {
              TWP2.PlayerUtil.player["weapons"][weapon["id"]]["kills"] = 0;
            }
            TWP2.PlayerUtil.player["weapons"][weapon["id"]]["kills"]++;
            if (_bHeadshot) {
              TWP2.PlayerUtil.player["weapons"][weapon["id"]]["headshots"]++;
            }
            var kills = TWP2.PlayerUtil.player["weapons"][weapon["id"]]["kills"];
            var killUnlocks = TWP2.WeaponDatabase.GetUnlocksForKills(weapon["id"], kills);
            if (killUnlocks.length > 0) {
              for (var i = 0; i < killUnlocks.length; i++) {
                TWP2.PlayerUtil.AddNewUnlock("mod", killUnlocks[i], { weaponId: weapon["id"] });
              }
            }
            arr = killUnlocks;
            if (_bHeadshot) {
              var headshots = TWP2.PlayerUtil.player["weapons"][weapon["id"]]["headshots"];
              var headshotUnlocks = TWP2.WeaponDatabase.GetUnlocksForHeadshots(weapon["id"], headshots);
              if (headshotUnlocks.length > 0) {
                for (var i = 0; i < headshotUnlocks.length; i++) {
                  TWP2.PlayerUtil.AddNewUnlock("mod", headshotUnlocks[i], { weaponId: weapon["id"] });
                }
              }
              arr = arr.concat(headshotUnlocks);
            }
            if (arr.length > 0) {
              for (var i = 0; i < arr.length; i++) {
                this.hud.addRankNotifier({
                  type: "weapon",
                  weaponId: weapon["id"],
                  modId: arr[i],
                  showTime: 2000,
                });
              }
            }
          }
        }
      }
      var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
      gameMode.addKills();
      if (_bHeadshot) {
        gameMode.addHeadshots();
      }
      if (gameMode.usesXP()) {
        if (_killed) {
          var killedPawn = _killed.getPawn();
          var xp = killedPawn.getXPReward() * (_bHeadshot ? 2 : 1) * this.character.getModifiers()[TWP2.Character.MODIFIER_XP];
          TWP2.PlayerUtil.AddXP(xp);
          this.hud.addXPNotifier(killedPawn.x, killedPawn.y - 50, xp, _bHeadshot, false, killedPawn.isBonus());
          var money = killedPawn.getMoneyReward();
          if (money > 0) {
            TWP2.PlayerUtil.AddMoney(money);
            var eventText;
            if (killedPawn instanceof TWP2.Harrier) {
              eventText = "Harrier destroyed!";
            } else {
              eventText = "Blue target destroyed!";
            }
            this.hud.addRankNotifier({
              type: "event",
              eventText: eventText,
              xpReward: undefined,
              moneyReward: money,
              showTime: 600,
            });
          }
          if (_bHeadshot) {
            if (this.character.getModifiers()[TWP2.Character.MODIFIER_XP] > 1) {
              var star = TWP2.GameUtil.GetGameState().createDebris(killedPawn.x, killedPawn.y - 50, 0, TWP2.Debris.DEBRIS_STAR);
              if (star) {
                star.getBody().applyForce(TWP2.MathUtil.Random(-100, 100), -TWP2.MathUtil.Random(100, 300));
              }
            }
          }
        }
      }
    };
    PlayerController.prototype.possess = function (_pawn) {
      _super.prototype.possess.call(this, _pawn);
      if (_pawn) {
        this.hud.setHasPawn(true);
      }
    };
    PlayerController.prototype.unPossess = function () {
      this.hud.setHasPawn(false);
    };
    PlayerController.prototype.onMultiKill = function (_kills) {
      if (_kills < 2) {
        return;
      }
      TWP2.GameUtil.GetGameState().getGameMode().addMultiKill();
      var bRanked = TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.RankedGameMode;
      var eventText;
      var xpReward;
      if (_kills == 2) {
        eventText = "Double kill!";
        xpReward = 25;
      } else if (_kills == 3) {
        eventText = "Triple kill!";
        xpReward = 50;
      } else if (_kills == 4) {
        eventText = "Quad kill!";
        xpReward = 75;
      } else {
        eventText = "Multi-kill!";
        xpReward = 100;
      }
      if (bRanked) {
        TWP2.PlayerUtil.AddXP(xpReward);
      }
      this.hud.addRankNotifier({
        type: "event",
        eventText: eventText,
        xpReward: bRanked ? xpReward : undefined,
        showTime: 600,
      });
    };
    PlayerController.prototype.getHUD = function () {
      return this.hud;
    };
    PlayerController.prototype.onMouseDown = function () {
      var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
      if (!gameMode.matchIsInProgress()) {
        return;
      }
      if (!this.canInput()) {
        return;
      }
      if (this.character) {
        if (this.character.isAlive()) {
          this.character.triggerWeapon(true);
        }
      }
    };
    PlayerController.prototype.onMouseUp = function () {
      var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
      if (!gameMode.matchIsInProgress()) {
        return;
      }
      if (this.character) {
        if (this.character.isAlive()) {
          this.character.triggerWeapon(false);
        }
      }
    };
    PlayerController.prototype.canInput = function () {
      return this.bInputEnabled;
    };
    return PlayerController;
  })(Controller);
  TWP2.PlayerController = PlayerController;
  var AIController = /** @class */ (function (_super) {
    __extends(AIController, _super);
    function AIController() {
      return _super.call(this) || this;
    }
    return AIController;
  })(Controller);
  TWP2.AIController = AIController;
  var AIController_Harrier = /** @class */ (function (_super) {
    __extends(AIController_Harrier, _super);
    function AIController_Harrier() {
      var _this = _super.call(this) || this;
      _this.randomizer = TWP2.MathUtil.Random(-200, 100);
      return _this;
    }
    AIController_Harrier.prototype.destroy = function () {
      this.harrier = null;
      _super.prototype.destroy.call(this);
    };
    AIController_Harrier.prototype.possess = function (_pawn) {
      _super.prototype.possess.call(this, _pawn);
      this.harrier = _pawn;
    };
    AIController_Harrier.prototype.unPossess = function () {
      _super.prototype.unPossess.call(this);
      this.harrier = null;
    };
    AIController_Harrier.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.harrier) {
        if (this.harrier.isAlive()) {
          if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
            var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
            if (player) {
              this.harrier.lookAt(player.x, player.y);
              var dist = TWP2.MathUtil.Dist(this.harrier.x, this.harrier.y, player.x, player.y);
              this.harrier.moveTo(player.x + 400, player.y + this.randomizer);
              if (dist < 600) {
                this.harrier.startWeaponFire();
              } else {
                this.harrier.stopWeaponFire();
              }
            }
          } else {
            this.harrier.stopWeaponFire();
          }
        }
      }
    };
    return AIController_Harrier;
  })(AIController);
  TWP2.AIController_Harrier = AIController_Harrier;
  var AIController_Soldier = /** @class */ (function (_super) {
    __extends(AIController_Soldier, _super);
    function AIController_Soldier() {
      return _super.call(this) || this;
    }
    AIController_Soldier.prototype.destroy = function () {
      this.soldier = null;
      _super.prototype.destroy.call(this);
    };
    AIController_Soldier.prototype.possess = function (_pawn) {
      _super.prototype.possess.call(this, _pawn);
      this.soldier = _pawn;
    };
    AIController_Soldier.prototype.unPossess = function () {
      _super.prototype.unPossess.call(this);
      this.soldier = null;
    };
    AIController_Soldier.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.soldier) {
        if (this.soldier.isAlive()) {
          if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
            var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
            if (player) {
              this.soldier.lookAt(player.x, player.y);
              var dist = TWP2.MathUtil.Dist(this.soldier.x, this.soldier.y, player.x, player.y);
              this.soldier.setMotorEnabled(dist > 400);
              if (dist < this.soldier.getRange()) {
                this.soldier.startWeaponFire();
              } else {
                this.soldier.stopWeaponFire();
              }
            }
          } else {
            this.soldier.stopWeaponFire();
          }
        }
      }
    };
    return AIController_Soldier;
  })(AIController);
  TWP2.AIController_Soldier = AIController_Soldier;
  var AIController_Target = /** @class */ (function (_super) {
    __extends(AIController_Target, _super);
    function AIController_Target() {
      var _this = _super.call(this) || this;
      _this.desiredY = 0;
      _this.desiredY = TWP2.MathUtil.Random(150, TWP2.GameUtil.game.world.height - 50);
      return _this;
    }
    AIController_Target.prototype.destroy = function () {
      this.target = null;
      _super.prototype.destroy.call(this);
    };
    AIController_Target.prototype.possess = function (_pawn) {
      _super.prototype.possess.call(this, _pawn);
      this.target = _pawn;
    };
    AIController_Target.prototype.unPossess = function () {
      _super.prototype.unPossess.call(this);
      this.target = null;
    };
    AIController_Target.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.target) {
        if (this.target.isAlive()) {
          if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
            if (this.target.getType() == TWP2.Target.TYPE_ATTACKER) {
              if (this.target.x < 50) {
                var defender = TWP2.GameUtil.GetGameState().getGameMode();
                defender.addDamage(10, this.target);
                this.target.suicide();
              } else {
                this.target.moveTo(0, this.desiredY);
              }
            }
          }
        }
      }
    };
    return AIController_Target;
  })(AIController);
  TWP2.AIController_Target = AIController_Target;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var HUD = /** @class */ (function (_super) {
    __extends(HUD, _super);
    function HUD() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.blocker = _this.game.add.image(0, 0, "blocker");
      _this.blocker.width = _this.game.width;
      _this.blocker.height = _this.game.height;
      _this.add(_this.blocker);
      _this.crosshair = new Crosshair();
      _this.add(_this.crosshair);
      _this.createInventoryInfo();
      _this.createGameInfo();
      _this.createMiddleInfo();
      _this.createModeInfo();
      _this.createPlayerInfo();
      _this.createKeyInfo();
      if (TWP2.APIUtil.ShouldShowSponsor()) {
        _this.sponsorButton = new TWP2.ImageButton("sponsor_ag_small");
        _this.sponsorButton.setCallback(_this.onSponsorClicked, _this);
        _this.sponsorButton.x = 10;
        _this.sponsorButton.y = _this.game.height - _this.sponsorButton.height - (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.GameMode_Range ? 10 : 24);
        _this.add(_this.sponsorButton);
      }
      _this.targetInfos = [];
      TWP2.GameUtil.game.addUIElement(_this);
      _this.setHasPawn(false);
      var gradient = _this.game.add.image(0, 0, "gradient");
      _this.addAt(gradient, 0);
      return _this;
    }
    HUD.prototype.destroy = function () {
      this.damageOverlay = null;
      this.damageTween = null;
      this.blocker = null;
      this.crosshair = null;
      this.addRankNotifier = null;
      this.targetInfos = null;
      this.inventoryInfo = null;
      this.playerInfo = null;
      this.gameInfo = null;
      TWP2.GameUtil.game.removeUIElement(this);
      _super.prototype.destroy.call(this);
    };
    HUD.prototype.tick = function () {
      if (this.crosshair) {
        this.crosshair.x = this.game.input.activePointer.x;
        this.crosshair.y = this.game.input.activePointer.y;
        this.crosshair.tick();
      }
      if (this.targetInfos) {
        for (var i = 0; i < this.targetInfos.length; i++) {
          var cur = this.targetInfos[i];
          var pawn = cur.getPawn();
          if (pawn) {
            var offset = 2;
            var padding = 20;
            var desiredX = pawn.x - this.game.world.camera.x / this.game.world.scale.x - cur.width * 0.5;
            var desiredY = pawn.y - this.game.world.camera.y / this.game.world.scale.y - cur.height * 0.5 - 30;
            desiredX *= this.game.world.scale.x;
            desiredY *= this.game.world.scale.y;
            var checkX = this.game.width - padding - cur.width * 0.5 - offset;
            cur.x = Math.max(offset, Math.min(checkX, desiredX));
            var checkY = this.game.height - padding - cur.height * 0.5 - offset;
            cur.y = Math.max(offset, Math.min(checkY, desiredY));
            if (cur.x == checkX || cur.x == offset) {
              cur.setOffScreen(true);
            } else if (cur.y == checkY || cur.y == offset) {
              cur.setOffScreen(true);
            } else {
              cur.setOffScreen(false);
            }
            cur.getHealthBar().setValue(pawn.getHealthPercent());
            if (pawn.isAlive() && pawn.destroyTimerIsEnabled()) {
              cur.showTimeBar();
              cur.setTimerValue(pawn.getDestroyTimer() / pawn.getDestroyTimerMax());
            }
            cur.visible = pawn.isAlive();
          }
        }
      }
    };
    HUD.prototype.onSponsorClicked = function () {
      TWP2.GameUtil.OpenAGHomepage();
      TWP2.GameUtil.GetGameState().setPaused(true, true);
    };
    HUD.prototype.show = function () {
      this.visible = true;
      this.crosshair.show();
    };
    HUD.prototype.hide = function () {
      this.visible = false;
      this.crosshair.hide();
    };
    HUD.prototype.onGamePaused = function () {
      if (this.rankNotifier) {
        this.rankNotifier.pauseQueueTimer();
      }
    };
    HUD.prototype.onGameResumed = function () {
      if (this.rankNotifier) {
        this.rankNotifier.resumeQueueTimer();
      }
    };
    HUD.prototype.onTakeDamage = function () {
      if (!this.damageOverlay) {
        var gfx = this.game.add.graphics();
        gfx.beginFill(0xff0000, 1);
        gfx.drawRect(0, 0, this.game.width, this.game.height);
        this.damageOverlay = this.game.add.image(0, 0, gfx.generateTexture());
        gfx.destroy();
        this.add(this.damageOverlay);
      }
      this.damageOverlay.alpha = 0.25;
      if (this.damageTween) {
        this.damageTween.stop();
      }
      this.damageTween = this.game.add.tween(this.damageOverlay).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
    };
    HUD.prototype.setBlockerVisible = function (_bVal) {
      var tween = this.game.add.tween(this.blocker).to({ alpha: _bVal ? 1 : 0 }, 200, Phaser.Easing.Exponential.Out, true);
      if (_bVal) {
        this.crosshair.hide();
        this.crosshair.setCanFire(false);
      } else {
        this.crosshair.show();
        this.crosshair.setCanFire(true);
      }
    };
    HUD.prototype.addCountdownText = function (_val) {
      if (_val) {
        var text = this.game.add.text(0, 0, _val, { font: "72px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        text.stroke = TWP2.ColourUtil.COLOUR_XP_STRING + "DD";
        text.strokeThickness = 5;
        TWP2.GameUtil.SetTextShadow(text);
        text.anchor.set(0.5, 0.5);
        text.x = this.game.width * 0.5;
        text.y = this.game.height * 0.5 + 50;
        this.add(text);
        var tween = this.game.add.tween(text).from({ y: this.game.height }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Back.InOut, true);
        var tween = this.game.add.tween(text).from({ alpha: 0 }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Exponential.InOut, true);
        tween.onComplete.addOnce(this.onTweenComplete, this, 0, text, false);
        TWP2.SoundManager.PlayUISound("ui_countdown", 0.5);
      }
    };
    HUD.prototype.onTweenComplete = function (_param1, _param2, _text, _bDestroy) {
      if (_text) {
        if (_bDestroy) {
          _text.destroy();
        } else {
          var tween = this.game.add.tween(_text).to({ y: this.game.height }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Exponential.InOut, true);
          var tween = this.game.add.tween(_text).to({ alpha: 0 }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Exponential.InOut, true);
          tween.onComplete.addOnce(this.onTweenComplete, this, 0, _text, true);
        }
      }
    };
    HUD.prototype.addXPNotifier = function (_x, _y, _value, _bHeadshot, _bMoney, _bBonus) {
      var xp = new RewardNotifier(_x - 12, _y, _value, _bHeadshot, _bMoney, _bBonus);
      TWP2.GameUtil.GetGameState().addToWorld(xp, TWP2.State_Game.INDEX_PAWNS);
    };
    HUD.prototype.addRankNotifier = function (_data) {
      if (this.modeInfo) {
        this.modeInfo.hide();
      }
      if (!this.rankNotifier) {
        this.rankNotifier = new RankNotifier();
        this.rankNotifier.x = this.game.width * 0.5 - this.rankNotifier.width * 0.5;
        this.rankNotifier.y = (this.middleInfo ? this.middleInfo.y + this.middleInfo.height : 0) + 4;
        this.rankNotifier.setDesiredY(this.rankNotifier.y);
        this.add(this.rankNotifier);
      }
      this.rankNotifier.pushToQueue(_data);
    };
    HUD.prototype.onPawnAdded = function (_pawn) {
      if (_pawn.isPlayer()) {
        return;
      }
      for (var i = 0; i < this.targetInfos.length; i++) {
        var cur = this.targetInfos[i];
        if (cur.getPawn() == _pawn) {
          return;
        }
      }
      var pawnInfo = new HUDTargetInfo(_pawn.getHealthBarWidth());
      pawnInfo.setPawn(_pawn);
      this.targetInfos.push(pawnInfo);
      this.addAt(pawnInfo, 0);
    };
    HUD.prototype.onPawnRemoved = function (_pawn) {
      for (var i = 0; i < this.targetInfos.length; i++) {
        var cur = this.targetInfos[i];
        if (cur.getPawn() == _pawn) {
          cur.destroy();
          this.targetInfos.splice(i, 1);
        }
      }
    };
    HUD.prototype.createInventoryInfo = function () {
      this.inventoryInfo = new InventoryInfo();
      this.inventoryInfo.x = 10;
      this.inventoryInfo.y = 10;
      this.add(this.inventoryInfo);
    };
    HUD.prototype.createGameInfo = function () {
      this.gameInfo = new GameInfo();
      this.gameInfo.x = this.game.width - this.gameInfo.width - 10;
      this.gameInfo.y = 10;
      this.add(this.gameInfo);
    };
    HUD.prototype.createModeInfo = function () {
      this.modeInfo = new ModeInfo();
      this.modeInfo.x = this.game.width * 0.5 - this.modeInfo.width * 0.5;
      this.modeInfo.y = this.game.height * 0.5 - this.modeInfo.height * 0.5 - 130;
      this.add(this.modeInfo);
    };
    HUD.prototype.createMiddleInfo = function () {
      this.middleInfo = new MiddleInfo();
      this.middleInfo.x = this.game.width * 0.5 - this.middleInfo.width * 0.5;
      this.middleInfo.y = 10;
      this.add(this.middleInfo);
    };
    HUD.prototype.createPlayerInfo = function () {
      this.playerInfo = new PlayerInfo();
      this.playerInfo.x = this.game.width * 0.5 - this.playerInfo.width * 0.5;
      this.playerInfo.y = this.game.height - this.playerInfo.height;
      this.add(this.playerInfo);
    };
    HUD.prototype.createKeyInfo = function () {
      this.keyInfo = new KeyInfo();
      this.keyInfo.x = this.game.width * 0.5 - this.keyInfo.width * 0.5;
      this.keyInfo.y = this.game.height - this.keyInfo.height - 60;
      this.add(this.keyInfo);
    };
    HUD.prototype.clearRankNotifiers = function () {
      if (this.rankNotifier) {
        this.rankNotifier.clearQueue();
      }
    };
    HUD.prototype.getCrosshair = function () {
      return this.crosshair;
    };
    HUD.prototype.getMiddleInfo = function () {
      return this.middleInfo;
    };
    HUD.prototype.getModeInfo = function () {
      return this.modeInfo;
    };
    HUD.prototype.getPlayerInfo = function () {
      return this.playerInfo;
    };
    HUD.prototype.getKeyInfo = function () {
      return this.keyInfo;
    };
    HUD.prototype.setHasPawn = function (_bVal) {
      this.inventoryInfo.visible = _bVal;
      if (_bVal) {
        this.crosshair.show();
      } else {
        this.crosshair.hide();
      }
    };
    HUD.prototype.getInventoryInfo = function () {
      return this.inventoryInfo;
    };
    HUD.prototype.getGameInfo = function () {
      return this.gameInfo;
    };
    HUD.COUNTDOWN_SPEED = 400;
    HUD.BACKGROUND_ALPHA = 0.75;
    return HUD;
  })(Phaser.Group);
  TWP2.HUD = HUD;
  var Crosshair = /** @class */ (function (_super) {
    __extends(Crosshair, _super);
    function Crosshair() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.size = 4;
      _this.recoil = 0;
      _this.bReloading = false;
      _this.bCanFire = false;
      var graphics = _this.game.add.graphics(0, 0);
      graphics.beginFill(0xffffff, 0.18);
      graphics.drawCircle(0, 0, 200);
      _this.recoilCircle = _this.game.add.image(0, 0, graphics.generateTexture());
      graphics.destroy();
      _this.recoilCircle.anchor.set(0.5, 0.5);
      _this.addChild(_this.recoilCircle);
      var graphics = _this.game.add.graphics();
      graphics.beginFill(0xffffff, 1);
      var size = 2;
      graphics.drawCircle(-size * 0.5, -size * 0.5, size);
      _this.dot = _this.game.add.image(0, 0, graphics.generateTexture());
      graphics.destroy();
      _this.dot.anchor.set(0.5, 0.5);
      _this.addChild(_this.dot);
      _this.addChild(_this.recoilCircle);
      _this.magIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_mag");
      _this.magIcon.anchor.set(0.5, 0.5);
      _this.addChild(_this.magIcon);
      _this.reloadGraphics = _this.game.add.graphics();
      _this.reloadGraphics.rotation = -90 * TWP2.MathUtil.TO_RADIANS;
      _this.add(_this.reloadGraphics);
      _this.setNeedsReload(false);
      _this.setCanFire(true);
      return _this;
    }
    Crosshair.prototype.destroy = function () {
      this.dot = null;
      this.magIcon = null;
      this.recoilCircle = null;
      this.reloadGraphics = null;
      this.checkmark = null;
      if (this.checkmarkTween) {
        this.checkmarkTween.stop();
        this.checkmarkTween = null;
      }
      _super.prototype.destroy.call(this);
    };
    Crosshair.prototype.tick = function () {
      var useSize = !this.bCanFire ? 0 : this.size;
      this.recoil -= (this.recoil - useSize) * 0.15;
      this.recoilCircle.scale.x = this.recoilCircle.scale.y = Math.min(this.recoil * 0.02, 6);
    };
    Crosshair.prototype.setNeedsReload = function (_bVal) {
      var bWasVisible = false; //this.reloadContainer.visible;
      //this.reloadContainer.visible = _bVal;
      if (_bVal && !bWasVisible) {
        //this.reloadContainer.alpha = 0.5;
        //var tween = this.game.add.tween(this.reloadContainer).to({ alpha: 0.1 }, 200, Phaser.Easing.Cubic.InOut, true, 0, Number.MAX_VALUE, true);
      }
    };
    Crosshair.prototype.setSize = function (_val) {
      this.size = Math.max(3, _val);
    };
    Crosshair.prototype.addRecoil = function (_val) {
      this.recoil += Math.min(_val, 60);
    };
    Crosshair.prototype.setCanFire = function (_bVal) {
      this.bCanFire = _bVal;
      this.dot.visible = _bVal;
      this.magIcon.visible = !_bVal;
      this.recoilCircle.alpha = _bVal ? 0.5 : 0;
    };
    Crosshair.prototype.onReloadComplete = function () {
      /*
          if (!this.checkmark)
          {
              this.checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
              this.checkmark.tint = ColourUtil.COLOUR_GREEN;
              this.checkmark.anchor.set(0.5, 0.5);
              this.add(this.checkmark);
          }
          this.checkmark.y = 40;
          this.checkmark.alpha = 1;
          if (this.checkmarkTween)
          {
              this.checkmarkTween.stop();
          }
          this.checkmarkTween = this.game.add.tween(this.checkmark).to({ alpha: 0, y: this.checkmark.y + 30 }, 350, Phaser.Easing.Exponential.InOut, true);
          */
    };
    Crosshair.prototype.setReloading = function (_bVal) {
      var bPrev = this.bReloading;
      this.bReloading = _bVal;
      if (!_bVal) {
        this.reloadGraphics.clear();
      }
      if (this.bReloading) {
        this.setNeedsReload(false);
      }
    };
    Crosshair.prototype.setReloadingPercentage = function (_val) {
      this.reloadGraphics.clear();
      if (_val > 0 && _val < 1) {
        var desiredColor = Phaser.Color.linearInterpolation([0xffffff, TWP2.ColourUtil.COLOUR_GREEN], _val);
        this.reloadGraphics.lineStyle(4, desiredColor, 0.8);
        this.reloadGraphics.arc(0, 0, 40, 0, 360 * TWP2.MathUtil.TO_RADIANS * _val, false);
      }
    };
    Crosshair.prototype.show = function () {
      this.visible = true;
      TWP2.GameUtil.game.showMouse(false);
    };
    Crosshair.prototype.hide = function () {
      this.visible = false;
      this.setReloading(false);
      TWP2.GameUtil.game.showMouse(true);
    };
    return Crosshair;
  })(Phaser.Group);
  TWP2.Crosshair = Crosshair;
  var HUDElement = /** @class */ (function (_super) {
    __extends(HUDElement, _super);
    function HUDElement() {
      return _super.call(this, TWP2.GameUtil.game) || this;
    }
    HUDElement.prototype.destroy = function () {
      this.visible = false;
      _super.prototype.destroy.call(this);
    };
    return HUDElement;
  })(Phaser.Group);
  TWP2.HUDElement = HUDElement;
  var KeyInfo = /** @class */ (function (_super) {
    __extends(KeyInfo, _super);
    function KeyInfo() {
      var _this = _super.call(this) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0xff0000, 0);
      bg.drawRect(0, 0, 300, 40);
      _this.add(bg);
      _this.mainContainer = _this.game.add.group();
      _this.gfx = _this.game.add.graphics();
      _this.gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
      _this.gfx.drawRoundedRect(0, 0, 180, 40, TWP2.GameUtil.RECT_RADIUS);
      _this.mainContainer.add(_this.gfx);
      var container = _this.game.add.group();
      _this.keyDetail = new TWP2.KeyDetail(TWP2.PlayerUtil.player.settings.controls[TWP2.PlayerUtil.CONTROL_BARREL], "Use barrel attachment", TWP2.KeyDetail.STYLE_GAME);
      _this.keyDetail.y = 0;
      container.add(_this.keyDetail);
      _this.gfx.width = 200; //this.keyDetail.width + 20;
      _this.mainContainer.add(container);
      container.x = 6;
      container.y = _this.height * 0.5 - container.height * 0.5;
      _this.mainContainer.x = _this.width * 0.5 - _this.mainContainer.width * 0.5;
      _this.add(_this.mainContainer);
      _this.onHide();
      return _this;
    }
    KeyInfo.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    KeyInfo.prototype.setFromRange = function () {
      this.keyDetail.setKey(Phaser.Keyboard.ESC);
      this.keyDetail.setDescText("Change/modify weapon");
      this.gfx.width = this.keyDetail.width + 20;
      this.mainContainer.x = this.width * 0.5 - this.mainContainer.width * 0.5;
    };
    KeyInfo.prototype.setFromMod = function (_id) {
      this.keyDetail.setKey(TWP2.PlayerUtil.player.settings.controls[TWP2.PlayerUtil.CONTROL_BARREL]);
      if (_id == TWP2.WeaponDatabase.BARREL_LASER) {
        this.keyDetail.setDescText("Toggle laser sight");
      } else if (_id == TWP2.WeaponDatabase.BARREL_M203) {
        this.keyDetail.setDescText("Fire grenade launcher");
      } else if (_id == TWP2.WeaponDatabase.BARREL_MASTERKEY) {
        this.keyDetail.setDescText("Fire shotgun");
      } else {
        this.keyDetail.setDescText("Use barrel attachment");
      }
      this.gfx.width = this.keyDetail.width + 20;
      this.mainContainer.x = this.width * 0.5 - this.mainContainer.width * 0.5;
    };
    KeyInfo.prototype.show = function () {
      this.visible = true;
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = this.game.add.tween(this).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
      if (this.timer) {
        this.timer.destroy();
      }
      this.timer = this.game.time.create();
      this.timer.add(3000, this.hide, this);
      this.timer.start();
    };
    KeyInfo.prototype.hide = function () {
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
      this.tween.onComplete.addOnce(this.onHide, this);
    };
    KeyInfo.prototype.onHide = function () {
      this.visible = false;
      this.alpha = 0;
    };
    return KeyInfo;
  })(HUDElement);
  TWP2.KeyInfo = KeyInfo;
  var PlayerInfo = /** @class */ (function (_super) {
    __extends(PlayerInfo, _super);
    function PlayerInfo() {
      var _this = _super.call(this) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, 0.35);
      gfx.drawRect(0, 0, _this.game.width, 20);
      _this.add(gfx);
      _this.rankBar = new TWP2.RankBar(_this.game.width - 8);
      _this.rankBar.x = _this.width * 0.5 - _this.rankBar.width * 0.5;
      _this.rankBar.y = _this.height * 0.5 - _this.rankBar.height * 0.5;
      _this.add(_this.rankBar);
      if (TWP2.GameUtil.GetGameState().getGameMode().usesXP()) {
        _this.updateXP();
        _this.updateRank();
      } else {
        _this.rankBar.visible = false;
        gfx.visible = false;
      }
      return _this;
    }
    PlayerInfo.prototype.destroy = function () {
      this.rankBar = null;
      _super.prototype.destroy.call(this);
    };
    PlayerInfo.prototype.updateForCurrentPlayer = function () {
      this.rankBar.updateForCurrentPlayer();
    };
    PlayerInfo.prototype.updateXP = function () {
      this.rankBar.updateXP();
    };
    PlayerInfo.prototype.updateRank = function () {
      this.rankBar.updateRank();
    };
    return PlayerInfo;
  })(HUDElement);
  TWP2.PlayerInfo = PlayerInfo;
  var GameInfo = /** @class */ (function (_super) {
    __extends(GameInfo, _super);
    function GameInfo() {
      var _this = _super.call(this) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
      gfx.drawRoundedRect(0, 0, InventoryInfo.MAX_WIDTH, 80, TWP2.GameUtil.RECT_RADIUS);
      _this.add(gfx);
      _this.container = _this.game.add.group();
      var leftTitle = _this.game.add.text(0, 0, "-", { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      leftTitle.setTextBounds(0, 0, _this.width * 0.5, 20);
      leftTitle.y = 4;
      _this.container.add(leftTitle);
      _this.leftText = _this.game.add.text(0, 0, "-", { font: "24px " + TWP2.FontUtil.FONT_HUD, fill: GameInfo.TEXT_COLOUR, boundsAlignH: "center", boundsAlignV: "middle" });
      _this.leftText.setTextBounds(0, 4, _this.width * 0.5, _this.height);
      _this.container.add(_this.leftText);
      var rightTitle = _this.game.add.text(_this.width * 0.5, 0, "-", { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      rightTitle.setTextBounds(0, 0, _this.width * 0.5, 20);
      rightTitle.y = 4;
      _this.container.add(rightTitle);
      _this.rightText = _this.game.add.text(_this.width * 0.5, 0, "-", { font: "24px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.rightText.setTextBounds(0, 4, _this.width * 0.5, _this.height);
      _this.container.add(_this.rightText);
      var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
      if (gameMode instanceof TWP2.GameMode_Range) {
        leftTitle.setText("Kills", true);
        rightTitle.setText("Shots Fired", true);
      } else if (gameMode instanceof TWP2.GameMode_Sniper) {
        leftTitle.setText("Targets", true);
        rightTitle.setText("Accuracy", true);
        _this.rightText.x -= 16;
      } else if (gameMode instanceof TWP2.RankedGameMode) {
        leftTitle.setText("Kills", true);
        rightTitle.setText("Accuracy", true);
        _this.rightText.x -= 16;
      }
      _this.container.y = _this.height * 0.5 - _this.container.height * 0.5;
      _this.add(_this.container);
      return _this;
    }
    GameInfo.prototype.destroy = function () {
      this.leftText = null;
      this.rightText = null;
      _super.prototype.destroy.call(this);
    };
    GameInfo.prototype.customUpdate = function (_data) {
      if (_data) {
        if (_data["kills"] != undefined) {
          this.updateLeftText(_data["kills"]);
        }
        if (_data["targetsRemaining"] != undefined) {
          this.updateLeftText(_data["targetsRemaining"]);
        }
        if (_data["shotsFired"] != undefined) {
          this.updateRightText(_data["shotsFired"]);
        }
        if (_data["accuracy"] != undefined) {
          this.updateRightText(Math.round(_data["accuracy"] * 100) + "%");
          this.updateAccuracy(_data["accuracy"]);
        }
      }
    };
    GameInfo.prototype.updateAccuracy = function (_val) {
      if (!this.accuracy) {
        this.accuracy = this.game.add.graphics();
        this.container.add(this.accuracy);
        this.accuracy.rotation = TWP2.MathUtil.ToRad(-90);
      }
      this.accuracy.alpha = _val == 0 ? 0.2 : 1;
      var size = 8;
      this.accuracy.clear();
      this.accuracy.beginFill(0xffffff, 0.2);
      this.accuracy.drawCircle(0, 0, size * 2 + 6);
      this.accuracy.endFill();
      this.accuracy.beginFill(_val == 0 ? TWP2.ColourUtil.COLOUR_RED : TWP2.ColourUtil.COLOUR_GREEN, 1);
      this.accuracy.drawCircle(0, 0, size * 2);
      this.accuracy.beginFill(TWP2.ColourUtil.COLOUR_RED, 0.8);
      this.accuracy.arc(0, 0, size, 0, 360 * TWP2.MathUtil.TO_RADIANS * _val, true);
      this.accuracy.endFill();
      this.accuracy.x = this.rightText.x + this.rightText.textBounds.width * 0.5 + this.rightText.width * 0.5 + this.accuracy.width * 0.5 + 6;
      this.accuracy.y = this.leftText.y + this.leftText.textBounds.height * 0.5;
    };
    GameInfo.prototype.updateLeftText = function (_val) {
      var str = ("00000" + _val).slice(-5);
      this.leftText.setText(str, true);
      var bIgnore = false;
      for (var i = 0; i < str.length; i++) {
        if (bIgnore) {
          this.leftText.addColor(GameInfo.TEXT_COLOUR, i);
        } else {
          if (str.charAt(i) == "0") {
            this.leftText.addColor("#333333", i);
          } else {
            this.leftText.addColor(GameInfo.TEXT_COLOUR, i);
            bIgnore = true;
          }
        }
      }
      //this.leftText.setText(_val, true);
    };
    GameInfo.prototype.updateRightText = function (_val) {
      var zeroStr = _val.indexOf("%") >= 0 ? "0000" : "00000";
      var str = (zeroStr + _val).slice(-zeroStr.length);
      this.rightText.setText(str, true);
      var bIgnore = false;
      for (var i = 0; i < str.length; i++) {
        if (bIgnore) {
          this.rightText.addColor("#FFFFFF", i);
        } else {
          if (str.charAt(i) == "0") {
            this.rightText.addColor("#333333", i);
          } else {
            this.rightText.addColor("#FFFFFF", i);
            bIgnore = true;
          }
        }
      }
    };
    GameInfo.TEXT_COLOUR = TWP2.ColourUtil.COLOUR_GREEN_STRING;
    return GameInfo;
  })(HUDElement);
  TWP2.GameInfo = GameInfo;
  var ModeInfo = /** @class */ (function (_super) {
    __extends(ModeInfo, _super);
    function ModeInfo() {
      var _this = _super.call(this) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, 0);
      gfx.drawRect(0, 0, 400, 180);
      _this.add(gfx);
      _this.alpha = 0;
      return _this;
    }
    ModeInfo.prototype.setGameMode = function (_id) {
      var gameMode = TWP2.GameModeDatabase.GetGameMode(_id);
      var icon = this.game.add.image(0, 0, "atlas_ui", gameMode["id"]);
      icon.x = this.width * 0.5 - icon.width * 0.5;
      icon.y = 4;
      this.add(icon);
      var nameText = this.game.add.text(0, 0, gameMode["name"], { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      TWP2.GameUtil.SetTextShadow(nameText);
      nameText.x = this.width * 0.5 - nameText.width * 0.5;
      nameText.y = icon.y + icon.height + 10;
      this.add(nameText);
      var descText = this.game.add.text(0, 0, gameMode["desc"], { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(descText);
      descText.x = this.width * 0.5 - descText.width * 0.5;
      descText.y = nameText.y + nameText.height - 4;
      this.add(descText);
      this.show();
    };
    ModeInfo.prototype.show = function () {
      var tween = this.game.add.tween(this).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
    };
    ModeInfo.prototype.hide = function () {
      if (this.game) {
        var hud = TWP2.GameUtil.GetGameState().getHUD();
        var tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
        tween.onComplete.addOnce(this.destroy, this);
      }
    };
    return ModeInfo;
  })(HUDElement);
  TWP2.ModeInfo = ModeInfo;
  var MiddleInfo = /** @class */ (function (_super) {
    __extends(MiddleInfo, _super);
    function MiddleInfo() {
      var _this = _super.call(this) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
      gfx.drawRoundedRect(0, 0, 200, 40, TWP2.GameUtil.RECT_RADIUS);
      _this.bg = _this.game.add.image(0, 0, gfx.generateTexture());
      _this.add(_this.bg);
      gfx.destroy();
      if (TWP2.GameUtil.GetGameState().getGameMode().getId() == TWP2.GameModeDatabase.GAME_RANGE) {
        var container = _this.game.add.group();
        var gfx = _this.game.add.graphics();
        gfx.beginFill(TWP2.ColourUtil.COLOUR_GREEN, 0.5);
        gfx.drawRoundedRect(0, 0, 90, 30, TWP2.GameUtil.RECT_RADIUS);
        var key = _this.game.add.image(0, 0, gfx.generateTexture());
        container.add(key);
        gfx.destroy();
        var keyText = _this.game.add.text(0, 2, TWP2.GameUtil.GetKeyStringFromId(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_ACTION]), {
          font: "16px " + TWP2.FontUtil.FONT,
          fill: "#FFFFFF",
          boundsAlignH: "center",
          boundsAlignV: "middle",
        });
        keyText.setTextBounds(key.x, key.y, key.width, key.height);
        container.add(keyText);
        var infoText = _this.game.add.text(key.x + key.width + 10, 0, "Create target", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        infoText.y = key.height * 0.5 - infoText.height * 0.5 + 2;
        container.add(infoText);
        _this.add(container);
        container.x = 6;
        container.y = _this.bg.height * 0.5 - container.height * 0.5;
      } else if (TWP2.GameUtil.GetGameState().getGameMode().getId() == TWP2.GameModeDatabase.GAME_DEFENDER || TWP2.GameUtil.GetGameState().getGameMode().getId() == TWP2.GameModeDatabase.GAME_WAR) {
        _this.healthBar = new TWP2.UIBar({
          w: _this.width - 12,
          h: 8,
          blocks: 5,
          bInterpColour: true,
          colours: TWP2.ColourUtil.GetHealthColours(),
          tweenFunc: Phaser.Easing.Exponential.Out,
        });
        _this.healthBar.x = _this.width * 0.5 - _this.healthBar.width * 0.5;
        _this.healthBar.y = _this.height * 0.5 - _this.healthBar.height * 0.5;
        _this.add(_this.healthBar);
        _this.healthBar.setValue(1);
      } else if (TWP2.GameUtil.GetGameState().getGameMode().getId() == TWP2.GameModeDatabase.GAME_LAVA) {
        _this.missedContainer = _this.game.add.group();
        for (var i = 0; i < TWP2.GameMode_Lava.TARGETS_MAX; i++) {
          var target = _this.game.add.image(0, 0, "atlas_ui", "icon_target_small");
          target.x = _this.missedContainer.width + (i > 0 ? 4 : 0);
          _this.missedContainer.add(target);
        }
        _this.missedContainer.x = _this.width * 0.5 - _this.missedContainer.width * 0.5;
        _this.missedContainer.y = _this.height * 0.5 - _this.missedContainer.height * 0.5;
        _this.add(_this.missedContainer);
      } else {
        var container = _this.game.add.group();
        var timerIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_timer");
        timerIcon.alpha = 0.2;
        timerIcon.y = 1;
        _this.timeText = _this.game.add.text(0, 0, "", { font: "24px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        _this.timeText.x = timerIcon.width + 12;
        container.add(_this.timeText);
        _this.updateTimeText(0, false);
        container.add(timerIcon);
        container.x = _this.width * 0.5 - container.width * 0.5;
        container.y = _this.height * 0.5 - container.height * 0.5 + 4;
        _this.add(container);
      }
      return _this;
    }
    MiddleInfo.prototype.destroy = function () {
      this.healthBar = null;
      this.bg = null;
      this.stopTween();
      this.timeText = null;
      _super.prototype.destroy.call(this);
    };
    MiddleInfo.prototype.stopTween = function () {
      if (this.tween) {
        this.tween.stop();
        this.tween = null;
      }
      if (this.timeText) {
        this.timeText.alpha = 1;
      }
    };
    MiddleInfo.prototype.updateTimeText = function (_val, _bTimeLimited) {
      if (!this.timeText) {
        return;
      }
      this.timeText.setText(TWP2.GameUtil.ConvertToTimeString(_val), true);
      if (_bTimeLimited) {
        if (_val == 0) {
          this.stopTween();
        } else if (_val == 1) {
          this.timeText.addColor(TWP2.ColourUtil.COLOUR_RED_STRING, 0);
          this.stopTween();
          this.tween = this.game.add.tween(this.timeText).to({ alpha: 0.35 }, 100, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
        } else if (_val == 5) {
          this.timeText.addColor(TWP2.ColourUtil.COLOUR_RED_STRING, 0);
          this.stopTween();
          this.tween = this.game.add.tween(this.timeText).to({ alpha: 0.35 }, 250, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
        } else if (_val == 10) {
          this.timeText.addColor(TWP2.ColourUtil.COLOUR_RED_STRING, 0);
          this.stopTween();
          this.tween = this.game.add.tween(this.timeText).to({ alpha: 0.35 }, 250, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
        }
      }
    };
    MiddleInfo.prototype.updateHealthBar = function (_val) {
      if (this.healthBar) {
        this.healthBar.setValue(_val);
      }
    };
    MiddleInfo.prototype.setMissedTargets = function (_val) {
      if (this.missedContainer) {
        var interp = Phaser.Color.linearInterpolation(TWP2.ColourUtil.GetHealthColours(), _val / TWP2.GameMode_Lava.TARGETS_MAX);
        for (var i = 0; i < this.missedContainer.length; i++) {
          var item = this.missedContainer.getAt(i);
          item.alpha = i >= _val ? 0.1 : 1;
          item.tint = interp;
        }
      }
    };
    return MiddleInfo;
  })(HUDElement);
  TWP2.MiddleInfo = MiddleInfo;
  var InventoryInfo = /** @class */ (function (_super) {
    __extends(InventoryInfo, _super);
    function InventoryInfo() {
      var _this = _super.call(this) || this;
      _this.bg = _this.game.add.graphics();
      _this.bg.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
      _this.bg.drawRoundedRect(0, 0, InventoryInfo.MAX_WIDTH, InventoryInfo.MAX_HEIGHT, TWP2.GameUtil.RECT_RADIUS);
      _this.add(_this.bg);
      _this.weaponText = _this.game.add.text(8, 0, "", { font: "20px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      TWP2.GameUtil.SetTextShadow(_this.weaponText);
      _this.weaponText.setTextBounds(0, 0, _this.bg.width * 0.5 - 4, _this.bg.height);
      _this.add(_this.weaponText);
      _this.magText = _this.game.add.text(0, 0, "0", { font: "24px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.magText.setTextBounds(0, 0, _this.bg.width * 0.4, _this.bg.height);
      _this.magText.x = _this.bg.width * 0.6;
      _this.add(_this.magText);
      _this.ammoIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_mag");
      _this.ammoIcon.anchor.set(0.5, 0.5);
      _this.ammoIcon.x = _this.magText.x + 14;
      _this.ammoIcon.y = _this.magText.y + _this.magText.textBounds.height * 0.5 - 2;
      _this.add(_this.ammoIcon);
      _this.ammoContainer = _this.game.add.group();
      _this.add(_this.ammoContainer);
      _this.rounds = [];
      _this.grenadeContainer = _this.game.add.group();
      _this.add(_this.grenadeContainer);
      _this.grenades = [];
      _this.inventory = _this.game.add.group();
      _this.add(_this.inventory);
      return _this;
    }
    InventoryInfo.prototype.destroy = function () {
      this.weaponText = null;
      this.magText = null;
      this.weaponIcon = null;
      this.ammoContainer = null;
      this.rounds = null;
      this.inventory = null;
      _super.prototype.destroy.call(this);
    };
    InventoryInfo.prototype.updateAmmo = function (_mag, _magMax) {
      var lowMax = _mag / _magMax;
      var lowRatio = 1 / 2;
      var bLowAmmo = lowMax < lowRatio;
      var lowAmmoColour = Phaser.Color.interpolateColor(TWP2.ColourUtil.COLOUR_RED, 0xffffff, lowRatio, lowMax);
      var str = ("000" + _mag).slice(-3);
      this.magText.setText(str, true);
      var bIgnore = false;
      for (var i = 0; i < str.length; i++) {
        if (bIgnore) {
          this.magText.addColor("#FFFFFF", i);
        } else {
          if (str.charAt(i) == "0") {
            this.magText.addColor("#333333", i);
          } else {
            this.magText.addColor("#FFFFFF", i);
            bIgnore = true;
          }
        }
      }
      for (var i = 0; i < this.rounds.length; i++) {
        var round = this.rounds[i];
        round.alpha = i < _mag ? 1 : 0.2;
        if (bLowAmmo) {
          round.tint = lowAmmoColour;
        } else {
          round.tint = 0xffffff;
        }
      }
    };
    InventoryInfo.prototype.updateGrenadeAmmo = function (_val, _max) {
      var lowMax = _val / _max;
      var lowRatio = 1 / 2;
      var bLowAmmo = lowMax < lowRatio;
      var lowAmmoColour = Phaser.Color.interpolateColor(TWP2.ColourUtil.COLOUR_RED, 0xffffff, lowRatio, lowMax);
      for (var i = 0; i < this.grenades.length; i++) {
        var grenade = this.grenades[i];
        grenade.alpha = i < _val ? 1 : 0.2;
        if (bLowAmmo) {
          grenade.tint = lowAmmoColour;
        } else {
          grenade.tint = 0xffffff;
        }
      }
    };
    InventoryInfo.prototype.updateSkills = function (_skills) {
      /*
          for (var i = 0; i < _skills.length; i++)
          {
              var icon = this.game.add.image(0, 0, "atlas_ui", _skills[i]);
              icon.alpha = 0.5;
              icon.scale.set(0.5, 0.5);
              icon.x = InventoryInfo.MAX_WIDTH + 4;
              icon.y = (InventoryInfo.MAX_HEIGHT * 0.5) - (icon.height * 0.5);
              this.add(icon);
          }
          */
    };
    InventoryInfo.prototype.updateWeapon = function (_data) {
      if (_data) {
        this.weaponText.setText(_data["name"], true);
        //this.weaponIcon.frameName = _data["id"];
        this.ammoContainer.removeAll(true);
        this.grenadeContainer.removeAll(true);
        this.rounds = [];
        var roundWidth = 2;
        var roundHeight = 6;
        if (_data["magSize"] == 1) {
          roundWidth = 4;
        }
        if (_data["type"] == TWP2.WeaponDatabase.TYPE_SHOTGUN) {
          roundWidth = 14;
        } else if (_data["type"] == TWP2.WeaponDatabase.TYPE_SNIPER) {
          if (_data["round"] == TWP2.WeaponDatabase.ROUND_50BMG) {
            roundWidth = 24;
            roundHeight = 4;
          } else if (_data["round"] == TWP2.WeaponDatabase.ROUND_556MM) {
            roundHeight = 12;
          } else {
            roundWidth = 18;
            roundHeight = 3;
          }
        } else if (_data["type"] == TWP2.WeaponDatabase.TYPE_RIFLE) {
          roundHeight = 8;
        } else if (_data["type"] == TWP2.WeaponDatabase.TYPE_LAUNCHER) {
          roundWidth = 18;
          roundHeight = 6;
        } else {
          if (_data["round"] == TWP2.WeaponDatabase.ROUND_50CAL || _data["round"] == TWP2.WeaponDatabase.ROUND_44) {
            roundWidth = 12;
            roundHeight = 4;
          }
        }
        var xCount = 0;
        var yCount = 0;
        var roundId = TWP2.WeaponDatabase.GetWeaponRoundId(_data["id"]);
        var maxX = 50;
        if (roundWidth >= 15) {
          maxX = 10;
        } else if (roundWidth >= 10) {
          maxX = 16;
        }
        for (var i = 0; i < _data["magSize"]; i++) {
          if (xCount >= maxX) {
            xCount = 0;
            yCount++;
          }
          var roundGfx = this.game.add.graphics();
          roundGfx.beginFill(0xffffff, 1);
          roundGfx.drawRect(0, 0, roundWidth, roundHeight);
          roundGfx.x = xCount * (roundWidth + 2);
          roundGfx.y = yCount * (roundHeight + 2);
          this.ammoContainer.add(roundGfx);
          this.rounds.push(roundGfx);
          xCount++;
        }
        this.ammoContainer.x = InventoryInfo.MAX_WIDTH * 0.5 - this.ammoContainer.width * 0.5;
        this.ammoContainer.y = InventoryInfo.MAX_HEIGHT - this.ammoContainer.height - 8;
        this.updateAmmo(_data["mag"], _data["magSize"]);
        if (_data["grenades"] != undefined) {
          this.ammoContainer.y -= 6;
          this.grenades = [];
          var roundWidth = 8;
          var roundHeight = 6;
          var xCount = 0;
          var yCount = 0;
          for (var i = 0; i < _data["grenadesMax"]; i++) {
            if (xCount >= 50) {
              xCount = 0;
              yCount++;
            }
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xffffff, 1);
            gfx.drawRect(0, 0, roundWidth, roundHeight);
            gfx.x = xCount * (roundWidth + 2);
            gfx.y = yCount * (roundHeight + 2);
            this.grenadeContainer.add(gfx);
            this.grenades.push(gfx);
            xCount++;
          }
          this.grenadeContainer.x = InventoryInfo.MAX_WIDTH * 0.5 - this.grenadeContainer.width * 0.5;
          this.grenadeContainer.y = this.ammoContainer.y + this.ammoContainer.height + 4;
          this.updateGrenadeAmmo(_data["grenades"], _data["grenadesMax"]);
        }
      }
    };
    InventoryInfo.prototype.updateInventory = function (_arr) {
      this.inventory.removeAll(true);
      for (var i = 0; i < _arr.length; i++) {
        var group = new InventoryItemContainer(i + 1, _arr[i]["id"], _arr.length);
        group.x = this.inventory.width + (i > 0 ? 2 : 0);
        this.inventory.add(group);
      }
      this.inventory.x = InventoryInfo.MAX_WIDTH * 0.5 - this.inventory.width * 0.5;
      this.inventory.y = this.bg.height + 2;
    };
    InventoryInfo.prototype.updateInventoryIndex = function (_val) {
      if (this.inventory) {
        for (var i = 0; i < this.inventory.length; i++) {
          var item = this.inventory.getAt(i);
          item.setSelected(_val == i);
        }
      }
    };
    InventoryInfo.MAX_WIDTH = 260;
    InventoryInfo.MAX_HEIGHT = 80;
    return InventoryInfo;
  })(HUDElement);
  TWP2.InventoryInfo = InventoryInfo;
  var InventoryItemContainer = /** @class */ (function (_super) {
    __extends(InventoryItemContainer, _super);
    function InventoryItemContainer(_index, _weaponId, _len) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.8);
      bg.drawRoundedRect(0, 0, _len == 1 ? InventoryInfo.MAX_WIDTH : 129, 50, TWP2.GameUtil.RECT_RADIUS);
      _this.add(bg);
      var item = _this.game.add.image(0, 0, "atlas_weapons_icons_small", _weaponId);
      item.anchor.set(0.5, 0.5);
      item.x = _this.width * 0.5;
      item.y = _this.height * 0.5;
      item.width = Math.min(bg.width - 4, item.width);
      item.scale.y = item.scale.x;
      _this.add(item);
      _this.checkmark = _this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      _this.checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
      _this.checkmark.scale.set(0.75, 0.75);
      _this.checkmark.x = _this.width - _this.checkmark.width;
      _this.checkmark.y = _this.height - _this.checkmark.height;
      _this.add(_this.checkmark);
      return _this;
    }
    InventoryItemContainer.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    InventoryItemContainer.prototype.setSelected = function (_bVal) {
      this.alpha = _bVal ? 1 : 0.5;
      this.checkmark.visible = _bVal;
    };
    return InventoryItemContainer;
  })(Phaser.Group);
  TWP2.InventoryItemContainer = InventoryItemContainer;
  var HUDTargetInfo = /** @class */ (function (_super) {
    __extends(HUDTargetInfo, _super);
    function HUDTargetInfo(_barWidth) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.arrowSize = 4;
      var useWidth = _barWidth;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
      gfx.drawRect(0, 0, useWidth, 6);
      _this.add(gfx);
      _this.healthBar = new TWP2.UIBar({
        w: _this.width - 4,
        h: 2,
        blocks: 4,
        bHideBarEdge: true,
        bInterpColour: true,
        colours: TWP2.ColourUtil.GetHealthColours(),
      });
      _this.bars = _this.game.add.group();
      _this.add(_this.bars);
      _this.bars.add(_this.healthBar);
      _this.bars.x = _this.width * 0.5 - _this.bars.width * 0.5;
      _this.bars.y = _this.height * 0.5 - _this.bars.height * 0.5;
      _this.updateBars();
      _this.visible = false;
      return _this;
    }
    HUDTargetInfo.prototype.destroy = function () {
      this.timer = null;
      this.healthBar = null;
      this.pawn = null;
      _super.prototype.destroy.call(this);
    };
    HUDTargetInfo.prototype.showTimeBar = function () {
      if (!this.timer) {
        this.timer = this.game.add.graphics();
        this.timer.x = this.width * 0.5;
        this.timer.y = -14;
        this.timer.rotation = -90 * TWP2.MathUtil.TO_RADIANS;
        this.add(this.timer);
      }
      this.updateBars();
    };
    HUDTargetInfo.prototype.setTimerValue = function (_val) {
      if (this.timer) {
        this.timer.clear();
        var size = 10;
        var colour = Phaser.Color.linearInterpolation([TWP2.ColourUtil.COLOUR_RED, 0xffffff], _val);
        this.timer.lineStyle(3, 0xffffff, 0.12);
        this.timer.arc(0, 0, size, 0, 360 * TWP2.MathUtil.TO_RADIANS, false);
        this.timer.lineStyle(3, colour, 0.9);
        this.timer.arc(0, 0, size, 0, 360 * TWP2.MathUtil.TO_RADIANS * _val, false);
        this.timer.endFill();
      }
    };
    HUDTargetInfo.prototype.updateBars = function () {
      //...
    };
    HUDTargetInfo.prototype.setPawn = function (_pawn) {
      this.pawn = _pawn;
    };
    HUDTargetInfo.prototype.getPawn = function () {
      return this.pawn;
    };
    HUDTargetInfo.prototype.getHealthBar = function () {
      return this.healthBar;
    };
    HUDTargetInfo.prototype.setOffScreen = function (_bVal) {
      this.alpha = _bVal ? 0.2 : 1;
    };
    return HUDTargetInfo;
  })(Phaser.Group);
  TWP2.HUDTargetInfo = HUDTargetInfo;
  var RewardNotifier = /** @class */ (function (_super) {
    __extends(RewardNotifier, _super);
    function RewardNotifier(_x, _y, _value, _bHeadshot, _bMoney, _bBonus) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.x = _x;
      _this.y = _y;
      var str = "+" + _value + "XP";
      _this.valueText = _this.game.add.text(0, 0, str, { font: "18px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF", align: "center" });
      _this.valueText.stroke = TWP2.ColourUtil.COLOUR_XP_STRING + "DD";
      _this.valueText.strokeThickness = 3;
      _this.add(_this.valueText);
      if (_bMoney) {
        var cash = _this.game.add.image(0, 0, "atlas_ui", "icon_buy");
        cash.x = _this.valueText.width * 0.5 - cash.width * 0.5;
        cash.y = -cash.height;
        cash.tint = TWP2.ColourUtil.COLOUR_MONEY;
        _this.add(cash);
      } else {
        if (_bHeadshot) {
          var star = _this.game.add.image(0, 0, "atlas_ui", "icon_star");
          star.x = _this.valueText.width * 0.5 - star.width * 0.5;
          star.y = -star.height;
          star.tint = TWP2.ColourUtil.COLOUR_XP;
          _this.add(star);
        }
      }
      _this.x -= _this.width * 0.5;
      _this.y -= _this.height * 0.5;
      var tween = _this.game.add.tween(_this).to({ y: _this.y - 30 }, 750, Phaser.Easing.Elastic.Out, true);
      var tween = _this.game.add.tween(_this).to({ alpha: 0 }, 750, Phaser.Easing.Exponential.In, true);
      return _this;
    }
    RewardNotifier.prototype.destroy = function () {
      this.valueText = null;
      _super.prototype.destroy.call(this);
    };
    return RewardNotifier;
  })(Phaser.Group);
  TWP2.RewardNotifier = RewardNotifier;
  var RankNotifier = /** @class */ (function (_super) {
    __extends(RankNotifier, _super);
    function RankNotifier() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.desiredY = 0;
      _this.showTime = 3000;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, 0.8);
      gfx.drawRoundedRect(0, 0, InventoryInfo.MAX_WIDTH + 80, 64, TWP2.GameUtil.RECT_RADIUS);
      _this.bg = _this.game.add.image(0, 0, gfx.generateTexture());
      _this.add(_this.bg);
      gfx.destroy();
      _this.container = _this.game.add.group();
      _this.add(_this.container);
      _this.alpha = 1;
      _this.queue = [];
      return _this;
    }
    RankNotifier.prototype.destroy = function () {
      this.container = null;
      this.queue = null;
      this.timer = null;
      _super.prototype.destroy.call(this);
    };
    RankNotifier.prototype.setDesiredY = function (_val) {
      this.desiredY = _val;
    };
    RankNotifier.prototype.setData = function (_data) {
      this.container.removeAll(true);
      if (_data["showTime"] != undefined) {
        this.showTime = _data["showTime"];
      } else {
        this.showTime = 3000;
      }
      if (_data["type"] == "rank") {
        var rankText = this.game.add.text(0, 0, "+" + TWP2.PlayerUtil.player["level"].toString(), { font: "50px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        rankText.x = 10;
        rankText.y = this.height * 0.5 - rankText.height * 0.5 + 2;
        this.container.add(rankText);
        var text = this.game.add.text(0, 0, "Promoted!", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        text.x = this.width * 0.5 - text.width * 0.5;
        text.y = this.height * 0.5 - text.height * 0.5 + 2;
        this.container.add(text);
        var rewardsContainer = this.game.add.group();
        var moneyBonus = TWP2.PlayerUtil.GetMoneyRewardForLevel(TWP2.PlayerUtil.player["level"]);
        var moneyText = this.game.add.text(0, 0, "+$" + TWP2.GameUtil.FormatNum(moneyBonus), { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING });
        rewardsContainer.add(moneyText);
        var skillText = this.game.add.text(0, 0, "+1 Skill", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_GREEN_STRING });
        skillText.y = rewardsContainer.height;
        rewardsContainer.add(skillText);
        rewardsContainer.x = this.width - rewardsContainer.width - 12;
        rewardsContainer.y = this.height * 0.5 - rewardsContainer.height * 0.5 + 3;
        this.container.add(rewardsContainer);
      } else if (_data["type"] == "weapon") {
        var weaponData = TWP2.WeaponDatabase.GetWeapon(_data["weaponId"]);
        if (weaponData) {
          var weaponIcon = this.game.add.image(0, 0, "atlas_weapons_icons_small", weaponData["id"]);
          weaponIcon.x = 10;
          weaponIcon.y = this.height * 0.5 - weaponIcon.height * 0.5;
          this.container.add(weaponIcon);
          if (_data["modId"]) {
            var modContainer = this.game.add.group();
            var modData = TWP2.WeaponDatabase.GetMod(_data["modId"]);
            var modIcon = this.game.add.image(0, 0, "atlas_ui", modData["id"]);
            modIcon.anchor.set(0, 0.5);
            modContainer.add(modIcon);
            var text = this.game.add.text(0, 0, modData["name"] + " unlocked", { font: "16px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_GREEN_STRING });
            text.anchor.set(0, 0.5);
            text.x = modIcon.x + modIcon.width + 8;
            text.y = 2;
            modContainer.add(text);
            var left = weaponIcon.x + weaponIcon.width;
            var right = this.width;
            modContainer.x = this.bg.width - modContainer.width - 12;
            modContainer.y = this.bg.height * 0.5;
            this.container.add(modContainer);
          }
          TWP2.SoundManager.PlayUISound("ui_challenge_complete", 0.8);
        }
      } else if (_data["type"] == "event") {
        var eventContainer = this.game.add.group();
        var eventText = this.game.add.text(0, 0, _data["eventText"], { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        eventContainer.add(eventText);
        if (_data["xpReward"] != undefined) {
          var xpRewardText = this.game.add.text(0, 0, "+" + _data["xpReward"] + "XP", { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
          xpRewardText.x = eventContainer.width * 0.5 - xpRewardText.width * 0.5;
          xpRewardText.y = eventContainer.height;
          eventContainer.add(xpRewardText);
        }
        if (_data["moneyReward"] != undefined) {
          var moneyRewardText = this.game.add.text(0, 0, "+$" + _data["moneyReward"], { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING });
          moneyRewardText.x = eventContainer.width * 0.5 - moneyRewardText.width * 0.5;
          moneyRewardText.y = eventContainer.height;
          eventContainer.add(moneyRewardText);
        }
        eventContainer.x = this.bg.width * 0.5 - eventContainer.width * 0.5;
        eventContainer.y = this.bg.height * 0.5 - eventContainer.height * 0.5 + 3;
        this.container.add(eventContainer);
        TWP2.SoundManager.PlayUISound("ui_star", 0.5);
      }
    };
    RankNotifier.prototype.pauseQueueTimer = function () {
      if (this.timer) {
        this.timer.pause();
      }
    };
    RankNotifier.prototype.resumeQueueTimer = function () {
      if (this.timer) {
        this.timer.resume();
      }
    };
    RankNotifier.prototype.clearQueue = function () {
      this.queue = [];
    };
    RankNotifier.prototype.pushToQueue = function (_data) {
      this.queue.push(_data);
      if (this.queue.length == 1) {
        this.loadNextInQueue();
      }
    };
    RankNotifier.prototype.show = function () {
      this.y = this.desiredY + 50;
      var tween = this.game.add.tween(this).to({ alpha: 1, y: this.desiredY }, 300, Phaser.Easing.Exponential.Out, true);
      if (this.timer) {
        this.timer.stop();
      }
      this.timer = this.game.time.create();
      this.timer.add(this.showTime, this.hide, this);
      this.timer.start();
    };
    RankNotifier.prototype.hide = function () {
      if (this.game) {
        var tween = this.game.add.tween(this).to({ alpha: 0, y: this.desiredY + 50 }, 300, Phaser.Easing.Exponential.In, true);
        tween.onComplete.addOnce(this.onHide, this);
      }
    };
    RankNotifier.prototype.onHide = function () {
      this.queue.splice(0, 1);
      if (this.queue.length > 0) {
        this.loadNextInQueue();
      }
    };
    RankNotifier.prototype.loadNextInQueue = function () {
      this.setData(this.queue[0]);
      this.show();
    };
    return RankNotifier;
  })(Phaser.Group);
  TWP2.RankNotifier = RankNotifier;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var GameMode = /** @class */ (function () {
    function GameMode() {
      this.shotsFired = 0;
      this.shotsHit = 0;
      this.kills = 0;
      this.headshots = 0;
      this.time = 0;
      this.multiKills = 0;
      this.targetsMissed = 0;
      this.bTimeLimited = false;
      this.bUseXP = true;
      this.bTrackMissedTargets = false;
      this.bAllowTargetRemoval = true;
      //...
    }
    GameMode.prototype.destroy = function () {
      this.data = null;
    };
    GameMode.prototype.getAllowTargetRemoval = function () {
      return this.bAllowTargetRemoval;
    };
    GameMode.prototype.getMultiKills = function () {
      return this.multiKills;
    };
    GameMode.prototype.addMultiKill = function () {
      this.multiKills++;
    };
    GameMode.prototype.tracksMissedTargets = function () {
      return this.bTrackMissedTargets;
    };
    GameMode.prototype.addTargetMissed = function () {
      this.targetsMissed++;
    };
    GameMode.prototype.getTargetsMissed = function () {
      return this.targetsMissed;
    };
    GameMode.prototype.onGamePaused = function () {
      //...
    };
    GameMode.prototype.onGameResumed = function () {
      //...
    };
    GameMode.prototype.getPlayerSpawnY = function () {
      return TWP2.GameUtil.game.world.height - 260;
    };
    GameMode.prototype.getTime = function () {
      return this.time;
    };
    GameMode.prototype.isTimeLimited = function () {
      return this.bTimeLimited;
    };
    GameMode.prototype.tick = function () {
      if (this.matchIsInProgress()) {
        if (this.bTimeLimited) {
          if (this.time > 0) {
            if (this.time <= 600) {
              if (this.time % 60 == 0) {
                TWP2.SoundManager.PlayUISound("ui_beep", 0.5);
              }
            }
            this.time--;
          } else if (this.time == 0) {
            this.endMatch();
          }
        } else {
          this.time++;
        }
        var hud = TWP2.GameUtil.GetGameState().getHUD();
        if (hud) {
          if (this.getId() != TWP2.GameModeDatabase.GAME_RANGE) {
            hud.getMiddleInfo().updateTimeText(this.time / 60, this.bTimeLimited);
          }
        }
      }
    };
    GameMode.prototype.usesXP = function () {
      return this.bUseXP;
    };
    GameMode.prototype.setFromData = function (_data) {};
    GameMode.prototype.setId = function (_val) {
      this.id = _val;
    };
    GameMode.prototype.getId = function () {
      return this.id;
    };
    GameMode.prototype.openClassSelectorMenu = function () {
      if (!this.classSelectorMenu) {
        this.classSelectorMenu = new TWP2.ClassSelectorMenu();
      } else {
        this.classSelectorMenu.show();
      }
    };
    GameMode.prototype.closeClassSelectorMenu = function () {
      if (this.classSelectorMenu) {
        this.classSelectorMenu.close();
      }
      this.classSelectorMenu.destroy();
      this.classSelectorMenu = null;
    };
    GameMode.prototype.openGameOverMenu = function () {
      if (!this.gameOverMenu) {
        this.gameOverMenu = new TWP2.GameOverMenu();
      } else {
        this.gameOverMenu.show();
      }
    };
    GameMode.prototype.closeGameOverMenu = function () {
      if (this.gameOverMenu) {
        this.gameOverMenu.close();
      }
      this.gameOverMenu.destroy();
      this.gameOverMenu = null;
    };
    GameMode.prototype.getShotsFired = function () {
      return this.shotsFired;
    };
    GameMode.prototype.addShotsFired = function () {
      this.shotsFired++;
      this.updateShotsFired();
      TWP2.PlayerUtil.player.stats["shotsFired"]++;
    };
    GameMode.prototype.updateShotsFired = function () {
      if (this.getId() == TWP2.GameModeDatabase.GAME_RANGE) {
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ shotsFired: this.shotsFired.toString() });
      } else {
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ accuracy: this.getAccuracy() });
      }
    };
    GameMode.prototype.getShotsHit = function () {
      return this.shotsHit;
    };
    GameMode.prototype.addShotsHit = function () {
      this.shotsHit++;
      if (this.getId() != TWP2.GameModeDatabase.GAME_RANGE) {
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ accuracy: this.getAccuracy() });
      }
      TWP2.PlayerUtil.player.stats["shotsHit"]++;
    };
    GameMode.prototype.getKills = function () {
      return this.kills;
    };
    GameMode.prototype.addKills = function () {
      this.kills++;
      if (this.getId() == TWP2.GameModeDatabase.GAME_SNIPER) {
        var sniper = TWP2.GameUtil.GetGameState().getGameMode();
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ targetsRemaining: sniper.getTargetsRemaining() });
      } else {
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ kills: this.kills });
      }
      if (this instanceof RankedGameMode) {
        TWP2.PlayerUtil.player.stats["kills"]++;
        var playerKills = TWP2.PlayerUtil.player.stats["kills"];
        if (playerKills == 10) {
          TWP2.PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_KILLS_1);
        } else if (playerKills == 100) {
          TWP2.PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_KILLS_2);
        } else if (playerKills == 1000) {
          TWP2.PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_KILLS_3);
        }
      }
    };
    GameMode.prototype.getHeadshots = function () {
      return this.headshots;
    };
    GameMode.prototype.addHeadshots = function () {
      this.headshots++;
      if (this instanceof RankedGameMode) {
        TWP2.PlayerUtil.player.stats["headshots"]++;
        var playerHeadshots = TWP2.PlayerUtil.player.stats["headshots"];
        if (playerHeadshots == 10) {
          TWP2.PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_HEADSHOTS_1);
        } else if (playerHeadshots == 100) {
          TWP2.PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_HEADSHOTS_2);
        } else if (playerHeadshots == 1000) {
          TWP2.PlayerUtil.UnlockAchievement(TWP2.Achievements.ACHIEVEMENT_HEADSHOTS_3);
        }
      }
    };
    GameMode.prototype.getAccuracy = function () {
      if (this.shotsFired <= 0) {
        return 0;
      }
      var accuracy = this.shotsHit / this.shotsFired;
      if (isNaN(accuracy)) {
        return 0;
      }
      return Math.min(accuracy, 1);
    };
    GameMode.prototype.setMatchIsWaitingToStart = function () {
      this.state = GameMode.STATE_WAITING_TO_START;
      this.handleMatchIsWaitingToStart();
    };
    GameMode.prototype.prepareGame = function () {
      this.state = GameMode.STATE_WAITING_PRE_MATCH;
      if (this.getId() == TWP2.GameModeDatabase.GAME_RANGE) {
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ shotsFired: "0" });
      } else {
        TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ accuracy: 0 });
      }
      TWP2.SoundManager.PlayMusic("music_game_1");
    };
    GameMode.prototype.startMatch = function () {
      this.state = GameMode.STATE_IN_PROGRESS;
      this.handleMatchHasStarted();
    };
    GameMode.prototype.endMatch = function () {
      this.state = GameMode.STATE_WAITING_POST_MATCH;
      TWP2.GameUtil.GetGameState().getHUD().getCrosshair().hide();
      TWP2.GameUtil.GetGameState().getHUD().clearRankNotifiers();
      this.handleMatchHasEnded();
    };
    GameMode.prototype.handleMatchIsWaitingToStart = function () {
      TWP2.GameUtil.GetGameState().getHUD().setBlockerVisible(true);
      this.updateShotsFired();
      TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ kills: "0" });
    };
    GameMode.prototype.handleMatchHasStarted = function () {
      TWP2.GameUtil.GetGameState().getHUD().setBlockerVisible(false);
      TWP2.SoundManager.PlayUISound("ui_game_start");
    };
    GameMode.prototype.handleMatchHasEnded = function () {
      TWP2.GameUtil.GetGameState().getHUD().setBlockerVisible(true);
      TWP2.SoundManager.PlayUISound("ui_game_end");
      var player = TWP2.GameUtil.GetGameState().getPlayerPawn().onMatchEnded();
      TWP2.GameUtil.game.savePlayerData();
    };
    GameMode.prototype.matchIsInProgress = function () {
      return this.state == GameMode.STATE_IN_PROGRESS;
    };
    GameMode.prototype.matchHasEnded = function () {
      return this.state == GameMode.STATE_WAITING_POST_MATCH;
    };
    GameMode.STATE_WAITING_TO_START = "STATE_WAITING_TO_START";
    GameMode.STATE_WAITING_PRE_MATCH = "STATE_WAITING_PRE_MATCH";
    GameMode.STATE_IN_PROGRESS = "STATE_IN_PROGRESS";
    GameMode.STATE_WAITING_POST_MATCH = "STATE_WAITING_POST_MATCH";
    GameMode.RESULT_WIN = "RESULT_WIN";
    GameMode.RESULT_LOSS = "RESULT_LOSS";
    return GameMode;
  })();
  TWP2.GameMode = GameMode;
  var GameMode_Range = /** @class */ (function (_super) {
    __extends(GameMode_Range, _super);
    function GameMode_Range() {
      var _this = _super.call(this) || this;
      _this.targetIndex = 0;
      _this.targetTypes = [
        [TWP2.Target.MATERIAL_DEFAULT, TWP2.Target.TYPE_DEFAULT],
        [TWP2.Target.MATERIAL_DEFAULT, TWP2.Target.TYPE_ROPE],
        [TWP2.Target.MATERIAL_DEFAULT, TWP2.Target.TYPE_ROTATOR],
        [TWP2.Target.MATERIAL_METAL, TWP2.Target.TYPE_DEFAULT],
        [TWP2.Target.MATERIAL_METAL, TWP2.Target.TYPE_ROPE],
        [TWP2.Target.MATERIAL_METAL, TWP2.Target.TYPE_ROTATOR],
      ];
      _this.bUseXP = false;
      return _this;
    }
    GameMode_Range.prototype.getCurrentTarget = function () {
      return this.targetTypes[this.targetIndex];
    };
    GameMode_Range.prototype.nextTargetType = function () {
      this.targetIndex++;
      if (this.targetIndex >= this.targetTypes.length) {
        this.targetIndex = 0;
      }
    };
    GameMode_Range.prototype.handleMatchIsWaitingToStart = function () {
      _super.prototype.handleMatchIsWaitingToStart.call(this);
      var char = TWP2.GameUtil.GetGameState().createPlayerCharacter(this.getPlayerSpawnY());
      var weapon = TWP2.WeaponDatabase.GetRandomWeapon();
      char.addInventoryItem(weapon);
      for (var i = 0; i < 6; i++) {
        TWP2.GameUtil.GetGameState().createTarget(char.x + 350 + 120 * i, char.y - 20, TWP2.Target.TYPE_ROPE, i >= 3 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT);
      }
      TWP2.GameUtil.GetGameState().createTarget(char.x + 350 + 120, char.y - 280, TWP2.Target.TYPE_ROTATOR);
      TWP2.GameUtil.GetGameState().createTarget(char.x + 350 + 480, char.y - 280, TWP2.Target.TYPE_ROTATOR, TWP2.Target.MATERIAL_METAL);
      this.startMatch();
    };
    GameMode_Range.prototype.handleMatchHasStarted = function () {
      _super.prototype.handleMatchHasStarted.call(this);
      TWP2.GameUtil.GetGameState().getHUD().getKeyInfo().setFromRange();
      TWP2.GameUtil.GetGameState().getHUD().getKeyInfo().show();
    };
    return GameMode_Range;
  })(GameMode);
  TWP2.GameMode_Range = GameMode_Range;
  var RankedGameMode = /** @class */ (function (_super) {
    __extends(RankedGameMode, _super);
    function RankedGameMode() {
      var _this = _super.call(this) || this;
      _this.preTimer = 240;
      if (TWP2.GameUtil.IsDebugging()) {
        //this.preTimer = 60;
      }
      return _this;
    }
    RankedGameMode.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.state == GameMode.STATE_WAITING_PRE_MATCH) {
        if (this.preTimer > 0) {
          if (this.preTimer % 60 == 0) {
            var seconds = this.preTimer / 60;
            if (seconds <= 3) {
              TWP2.GameUtil.GetGameState()
                .getHUD()
                .addCountdownText((this.preTimer / 60).toString());
            }
          }
          this.preTimer--;
        } else if (this.preTimer == 0) {
          var hud = TWP2.GameUtil.GetGameState().getHUD();
          hud.addCountdownText("GO");
          hud.getModeInfo().hide();
          this.startMatch();
        }
      }
    };
    RankedGameMode.prototype.addShotsFired = function () {
      _super.prototype.addShotsFired.call(this);
      TWP2.PlayerUtil.player.stats["shotsFired_ranked"]++;
      var playerShotsFired = TWP2.PlayerUtil.player.stats["shotsFired_ranked"];
    };
    RankedGameMode.prototype.addKills = function () {
      _super.prototype.addKills.call(this);
      TWP2.PlayerUtil.player.stats["kills_ranked"]++;
      var playerKills = TWP2.PlayerUtil.player.stats["kills_ranked"];
    };
    RankedGameMode.prototype.addHeadshots = function () {
      _super.prototype.addHeadshots.call(this);
      TWP2.PlayerUtil.player.stats["headshots_ranked"]++;
      var playerHeadshots = TWP2.PlayerUtil.player.stats["headshots_ranked"];
    };
    RankedGameMode.prototype.handleMatchIsWaitingToStart = function () {
      _super.prototype.handleMatchIsWaitingToStart.call(this);
      this.openClassSelectorMenu();
    };
    RankedGameMode.prototype.handleMatchHasEnded = function () {
      _super.prototype.handleMatchHasEnded.call(this);
      var timer = TWP2.GameUtil.game.time.create();
      timer.add(1000, this.openGameOverMenu, this);
      timer.start();
    };
    return RankedGameMode;
  })(GameMode);
  TWP2.RankedGameMode = RankedGameMode;
  var GameMode_Lava = /** @class */ (function (_super) {
    __extends(GameMode_Lava, _super);
    function GameMode_Lava() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 60;
      _this.materialMax = 20;
      _this.lavaTargetsMissed = 1;
      _this.lavaTargetsMissed = GameMode_Lava.TARGETS_MAX;
      _this.bTimeLimited = false;
      var ground = TWP2.GameUtil.GetGameState().getGroundBody();
      _this.lavas = [];
      for (var i = 0; i < 15; i++) {
        var lava = TWP2.GameUtil.game.add.sprite(0, 0, "atlas_lava");
        lava.animations.add("lava");
        lava.animations.play("lava", 30, true);
        lava.scale.set(0.5, 0.5);
        lava.x = (lava.width - 10) * i - 8;
        lava.y = TWP2.GameUtil.game.world.height - lava.height + 15;
        TWP2.GameUtil.GetGameState().addToWorld(lava, TWP2.State_Game.INDEX_LAVA);
        _this.lavas.push(lava);
      }
      return _this;
    }
    GameMode_Lava.prototype.onGamePaused = function () {
      _super.prototype.onGamePaused.call(this);
      if (this.lavas) {
        for (var i = 0; i < this.lavas.length; i++) {
          this.lavas[i].animations.stop("lava");
        }
      }
    };
    GameMode_Lava.prototype.onGameResumed = function () {
      _super.prototype.onGameResumed.call(this);
      if (this.lavas) {
        for (var i = 0; i < this.lavas.length; i++) {
          this.lavas[i].play("lava", 30, true);
        }
      }
    };
    GameMode_Lava.prototype.handleMatchIsWaitingToStart = function () {
      _super.prototype.handleMatchIsWaitingToStart.call(this);
      TWP2.GameUtil.GetGameState().getHUD().getMiddleInfo().setMissedTargets(this.lavaTargetsMissed);
    };
    GameMode_Lava.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
        }
        if (this.time % 120 == 0) {
          this.creationMod = Math.max(5, this.creationMod - 1);
        }
        if (this.time % 1000 == 0) {
          this.materialMax = Math.max(2, this.materialMax - 1);
        }
      }
    };
    GameMode_Lava.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_LAVA;
        var material = TWP2.MathUtil.Random(1, this.materialMax) == 1 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT;
        var target = TWP2.GameUtil.GetGameState().createTarget(TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.2, TWP2.GameUtil.game.world.width * 0.8), 80, targetType, material);
        target.getBody().angularVelocity += TWP2.MathUtil.Random(-5, 5);
      }
    };
    GameMode_Lava.prototype.getLavaTargetsMissed = function () {
      return this.lavaTargetsMissed;
    };
    GameMode_Lava.prototype.addMissedLavaTarget = function () {
      if (this.matchIsInProgress()) {
        TWP2.GameUtil.GetGameState().getHUD().onTakeDamage();
        this.lavaTargetsMissed--;
        TWP2.GameUtil.GetGameState().getHUD().getMiddleInfo().setMissedTargets(this.lavaTargetsMissed);
        if (this.lavaTargetsMissed <= 0) {
          this.endMatch();
        }
      }
    };
    GameMode_Lava.TARGETS_MAX = 8;
    return GameMode_Lava;
  })(RankedGameMode);
  TWP2.GameMode_Lava = GameMode_Lava;
  var GameMode_MultiShooter = /** @class */ (function (_super) {
    __extends(GameMode_MultiShooter, _super);
    function GameMode_MultiShooter() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 40;
      _this.bTimeLimited = true;
      _this.time = 3600;
      _this.bTrackMissedTargets = true;
      return _this;
    }
    GameMode_MultiShooter.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
        }
      }
    };
    GameMode_MultiShooter.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_DEFAULT;
        var rand = TWP2.MathUtil.Random(1, 4);
        if (rand == 1) {
          targetType = TWP2.Target.TYPE_ROPE;
        } else if (rand == 2) {
          targetType = TWP2.Target.TYPE_ROTATOR;
        }
        var material = TWP2.MathUtil.Random(1, 10) == 1 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT;
        var target = TWP2.GameUtil.GetGameState().createTarget(
          TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.2, TWP2.GameUtil.game.world.width * 0.8),
          TWP2.MathUtil.Random(200, TWP2.GameUtil.game.world.height - 150),
          targetType,
          material
        );
        target.setDestroyTimer(TWP2.MathUtil.Random(20, 100) / 10);
        target.enableDestroyTimer();
      }
    };
    return GameMode_MultiShooter;
  })(RankedGameMode);
  TWP2.GameMode_MultiShooter = GameMode_MultiShooter;
  var GameMode_Reflex = /** @class */ (function (_super) {
    __extends(GameMode_Reflex, _super);
    function GameMode_Reflex() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 30;
      _this.bTimeLimited = true;
      _this.time = 1800;
      _this.bTrackMissedTargets = true;
      return _this;
    }
    GameMode_Reflex.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
        }
      }
    };
    GameMode_Reflex.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_ROPE;
        var material = TWP2.Target.MATERIAL_DEFAULT;
        var target = TWP2.GameUtil.GetGameState().createTarget(
          TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.2, TWP2.GameUtil.game.world.width * 0.8),
          TWP2.MathUtil.Random(200, TWP2.GameUtil.game.world.height - 150),
          targetType,
          material
        );
        target.setDestroyTimer(1);
        target.enableDestroyTimer();
      }
    };
    return GameMode_Reflex;
  })(RankedGameMode);
  TWP2.GameMode_Reflex = GameMode_Reflex;
  var GameMode_Hardened = /** @class */ (function (_super) {
    __extends(GameMode_Hardened, _super);
    function GameMode_Hardened() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 65;
      _this.damageMultiplier = 1;
      _this.bTimeLimited = true;
      _this.time = 3600;
      return _this;
    }
    GameMode_Hardened.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
          this.damageMultiplier -= 0.01;
        }
      }
    };
    GameMode_Hardened.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_DEFAULT;
        var rand = TWP2.MathUtil.Random(1, 4);
        if (rand == 1) {
          targetType = TWP2.Target.TYPE_ROPE;
        } else if (rand == 2) {
          targetType = TWP2.Target.TYPE_ROTATOR;
        }
        var target = TWP2.GameUtil.GetGameState().createTarget(
          TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.2, TWP2.GameUtil.game.world.width * 0.8),
          TWP2.MathUtil.Random(200, TWP2.GameUtil.game.world.height - 150),
          targetType,
          TWP2.Target.MATERIAL_METAL
        );
        target.setDamageMultiplier(this.damageMultiplier);
      }
    };
    return GameMode_Hardened;
  })(RankedGameMode);
  TWP2.GameMode_Hardened = GameMode_Hardened;
  var GameMode_TimeAttack = /** @class */ (function (_super) {
    __extends(GameMode_TimeAttack, _super);
    function GameMode_TimeAttack() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 12;
      _this.bTimeLimited = true;
      _this.time = 1800;
      return _this;
    }
    GameMode_TimeAttack.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
        }
      }
    };
    GameMode_TimeAttack.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_DEFAULT;
        var rand = TWP2.MathUtil.Random(1, 7);
        if (rand == 1) {
          targetType = TWP2.Target.TYPE_ROPE;
        } else if (rand == 2) {
          targetType = TWP2.Target.TYPE_ROTATOR;
        }
        var material = TWP2.MathUtil.Random(1, 10) == 1 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT;
        var target = TWP2.GameUtil.GetGameState().createTarget(
          TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.2, TWP2.GameUtil.game.world.width * 0.8),
          TWP2.MathUtil.Random(200, TWP2.GameUtil.game.world.height - 150),
          targetType,
          material
        );
      }
    };
    return GameMode_TimeAttack;
  })(RankedGameMode);
  TWP2.GameMode_TimeAttack = GameMode_TimeAttack;
  var GameMode_Sniper = /** @class */ (function (_super) {
    __extends(GameMode_Sniper, _super);
    function GameMode_Sniper() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 50;
      _this.targetsRemaining = 0;
      _this.targetsSpawned = 0;
      TWP2.GameUtil.GetGameState().setMaxPawns(5);
      _this.targetsRemaining = GameMode_Sniper.NUM_TARGETS;
      _this.bAllowTargetRemoval = false;
      return _this;
    }
    GameMode_Sniper.prototype.handleMatchIsWaitingToStart = function () {
      _super.prototype.handleMatchIsWaitingToStart.call(this);
      TWP2.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ targetsRemaining: this.getTargetsRemaining() });
    };
    GameMode_Sniper.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        if (this.targetsRemaining > 0 && this.targetsSpawned < GameMode_Sniper.NUM_TARGETS) {
          this.ticker++;
          if (this.ticker >= this.creationMod) {
            this.ticker = 0;
            this.createTarget();
          }
        }
      }
    };
    GameMode_Sniper.prototype.addKills = function () {
      this.targetsRemaining--;
      _super.prototype.addKills.call(this);
      if (this.targetsRemaining == 0) {
        this.endMatch();
      }
    };
    GameMode_Sniper.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_DEFAULT;
        var rand = TWP2.MathUtil.Random(1, 3);
        if (rand == 1) {
          targetType = TWP2.Target.TYPE_ROPE;
        } else if (rand == 2) {
          targetType = TWP2.Target.TYPE_ROTATOR;
        }
        var material = TWP2.MathUtil.Random(1, 10) == 1 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT;
        var target = TWP2.GameUtil.GetGameState().createTarget(
          TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.6, TWP2.GameUtil.game.world.width * 0.92),
          TWP2.MathUtil.Random(200, TWP2.GameUtil.game.world.height - 150),
          targetType,
          material
        );
        this.targetsSpawned++;
      }
    };
    GameMode_Sniper.prototype.getTargetsRemaining = function () {
      return this.targetsRemaining;
    };
    GameMode_Sniper.NUM_TARGETS = 50;
    return GameMode_Sniper;
  })(RankedGameMode);
  TWP2.GameMode_Sniper = GameMode_Sniper;
  var GameMode_Defender = /** @class */ (function (_super) {
    __extends(GameMode_Defender, _super);
    function GameMode_Defender() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 60;
      _this.speedMin = 0;
      _this.speedMax = 0;
      _this.maxSpeed = 120;
      _this.health = 100;
      _this.healthMax = 100;
      _this.speedMin = 10;
      _this.speedMax = 60;
      _this.bAllowTargetRemoval = false;
      TWP2.GameUtil.GetGameState().setMaxPawns(18);
      return _this;
    }
    GameMode_Defender.prototype.destroy = function () {
      this.baseImage = null;
      _super.prototype.destroy.call(this);
    };
    GameMode_Defender.prototype.addDamage = function (_val, _pawn) {
      if (this.matchIsInProgress()) {
        TWP2.GameUtil.GetGameState().getHUD().onTakeDamage();
        this.health = Math.max(0, this.health - _val);
        TWP2.GameUtil.GetGameState().shakeCamera(_val);
        TWP2.SoundManager.PlayWorldSound("explosion", _pawn.x, _pawn.y, 3);
        this.updateHealth();
        if (this.health <= 0) {
          this.endMatch();
        }
      }
    };
    GameMode_Defender.prototype.updateHealth = function () {
      var healthPercentage = this.getHealthPercentage();
      TWP2.GameUtil.GetGameState().getHUD().getMiddleInfo().updateHealthBar(healthPercentage);
      if (this.baseImage) {
        var interp = Phaser.Color.linearInterpolation([0xcc0000, 0xff9933, 0x00cc00], healthPercentage);
        this.baseImage.tint = interp;
      }
    };
    GameMode_Defender.prototype.getHealth = function () {
      return this.health;
    };
    GameMode_Defender.prototype.getHealthPercentage = function () {
      return Math.max(0, this.health / this.healthMax);
    };
    GameMode_Defender.prototype.getSpeedMin = function () {
      return this.speedMin;
    };
    GameMode_Defender.prototype.getSpeedMax = function () {
      return this.speedMax;
    };
    GameMode_Defender.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        if (this.time % 450 == 0) {
          this.speedMin = Math.min(this.maxSpeed, this.speedMin + 2);
          this.speedMax = Math.min(this.maxSpeed, this.speedMax + 2);
          this.creationMod = Math.max(1, this.creationMod - 2);
        }
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
        }
      }
    };
    GameMode_Defender.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var targetType = TWP2.Target.TYPE_ATTACKER;
        var material = TWP2.MathUtil.Random(1, this.time < 3600 ? 10 : 5) == 1 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT;
        var target = TWP2.GameUtil.GetGameState().createTarget(TWP2.GameUtil.game.world.width * 0.95, TWP2.MathUtil.Random(200, TWP2.GameUtil.game.world.height - 150), targetType, material);
      }
    };
    GameMode_Defender.prototype.handleMatchIsWaitingToStart = function () {
      _super.prototype.handleMatchIsWaitingToStart.call(this);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 1);
      gfx.drawRect(0, 0, 50, TWP2.GameUtil.game.world.height);
      TWP2.GameUtil.GetGameState().addToWorld(gfx, TWP2.State_Game.INDEX_WALLS);
      this.baseImage = TWP2.GameUtil.game.add.image(0, 0, gfx.generateTexture());
      this.baseImage.alpha = 0.2;
      gfx.destroy();
      var tween = TWP2.GameUtil.game.add.tween(this.baseImage).to({ alpha: 0.1 }, 500, Phaser.Easing.Exponential.InOut, true, 0, Number.MAX_VALUE, true);
      this.updateHealth();
    };
    GameMode_Defender.prototype.handleMatchHasEnded = function () {
      _super.prototype.handleMatchHasEnded.call(this);
      var pawns = TWP2.GameUtil.GetGameState().getPawns();
      for (var i = 0; i < pawns.length; i++) {
        var pawn = pawns[i];
        if (!pawn.isPlayer() && pawn.isAlive()) {
          //pawn.triggerDestroy();
          pawn.getBody().angularVelocity += TWP2.MathUtil.Random(-50, 50);
          pawn.getBody().gravityScale = 1;
        }
      }
    };
    GameMode_Defender.prototype.getPlayerSpawnY = function () {
      return TWP2.GameUtil.game.world.height * 0.5;
    };
    return GameMode_Defender;
  })(RankedGameMode);
  TWP2.GameMode_Defender = GameMode_Defender;
  var GameMode_War = /** @class */ (function (_super) {
    __extends(GameMode_War, _super);
    function GameMode_War() {
      var _this = _super.call(this) || this;
      _this.ticker = 0;
      _this.creationMod = 120;
      _this.health = 100;
      _this.healthMax = 100;
      _this.regenTimer = 0;
      _this.materialRandMax = 50;
      _this.weaponRandMax = 10;
      _this.harrierRandomMax = 20;
      _this.desiredSpeed = 1000;
      _this.damageMultiplier = 1;
      TWP2.GameUtil.GetGameState().setMaxPawns(18);
      return _this;
    }
    GameMode_War.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    GameMode_War.prototype.addDamage = function (_val, _pawn) {
      if (this.matchIsInProgress()) {
        this.regenTimer = 180;
        var hud = TWP2.GameUtil.GetGameState().getHUD();
        hud.onTakeDamage();
        this.health = Math.max(0, this.health - _val);
        TWP2.GameUtil.GetGameState().shakeCamera(_val);
        this.updateHealth();
        if (this.health <= 0) {
          this.endMatch();
        }
      }
    };
    GameMode_War.prototype.updateHealth = function () {
      var healthPercentage = this.getHealthPercentage();
      TWP2.GameUtil.GetGameState().getHUD().getMiddleInfo().updateHealthBar(healthPercentage);
    };
    GameMode_War.prototype.getHealth = function () {
      return this.health;
    };
    GameMode_War.prototype.getHealthPercentage = function () {
      return Math.max(0, this.health / this.healthMax);
    };
    GameMode_War.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.matchIsInProgress()) {
        if (this.regenTimer > 0) {
          this.regenTimer--;
        } else {
          if (this.health < this.healthMax) {
            this.health++;
            this.updateHealth();
          }
        }
        this.ticker++;
        if (this.ticker >= this.creationMod) {
          this.ticker = 0;
          this.createTarget();
        }
        if (this.time > 0) {
          if (this.time % 200 == 0) {
            this.harrierRandomMax = Math.max(this.harrierRandomMax - 1, 10);
            this.damageMultiplier *= 0.975;
          }
          if (this.time % 75 == 0) {
            this.creationMod = Math.max(15, this.creationMod - 1);
          }
          if (this.time % 400 == 0) {
            this.materialRandMax = Math.max(this.materialRandMax - 1, 1);
            this.weaponRandMax = Math.max(this.weaponRandMax - 1, 2);
          }
        }
      }
    };
    GameMode_War.prototype.createTarget = function () {
      if (TWP2.GameUtil.GetGameState().getNumLivingTargets() < TWP2.GameUtil.GetGameState().getMaxPawns()) {
        var damageMod = Math.max(0.0000001, this.damageMultiplier);
        console.log(damageMod);
        var bHarrier = TWP2.MathUtil.Random(1, this.harrierRandomMax) == 1;
        if (bHarrier) {
          var harrier = TWP2.GameUtil.GetGameState().createHarrier(TWP2.GameUtil.game.world.width * 0.95, TWP2.MathUtil.Random(TWP2.GameUtil.game.world.height * 0.1, TWP2.GameUtil.game.world.height * 0.5));
          harrier.setDamageMultiplier(Math.min(1, damageMod * 2));
        }
        var material = TWP2.MathUtil.Random(1, this.materialRandMax) == 1 ? TWP2.Target.MATERIAL_METAL : TWP2.Target.MATERIAL_DEFAULT;
        var weapon = TWP2.MathUtil.Random(1, this.weaponRandMax) == 1 ? TWP2.Soldier.WEAPON_SNIPER : TWP2.Soldier.WEAPON_DEFAULT;
        var player = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var soldier = TWP2.GameUtil.GetGameState().createSoldier(TWP2.MathUtil.Random(TWP2.GameUtil.game.world.width * 0.8, TWP2.GameUtil.game.world.width * 0.95), TWP2.GameUtil.game.world.height - 120, material, weapon, this.desiredSpeed);
        soldier.setDamageMultiplier(damageMod);
      }
    };
    GameMode_War.prototype.handleMatchIsWaitingToStart = function () {
      _super.prototype.handleMatchIsWaitingToStart.call(this);
      this.updateHealth();
    };
    return GameMode_War;
  })(RankedGameMode);
  TWP2.GameMode_War = GameMode_War;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var WorldObject = /** @class */ (function (_super) {
    __extends(WorldObject, _super);
    function WorldObject(_id, _x, _y, _rotation) {
      if (_rotation === void 0) {
        _rotation = 0;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.destroyTimerMax = 60;
      _this.destroyTimer = 60;
      _this.bDestroyTimerEnabled = false;
      _this.bPendingDestroy = false;
      _this.bDestroyedByTimer = false;
      _this.id = _id;
      _this.x = _x;
      _this.y = _y;
      _this.rotation = _rotation;
      _this.bodies = [];
      TWP2.GameUtil.GetGameState().addToWorld(_this);
      return _this;
    }
    WorldObject.prototype.destroy = function () {
      this.destroyAllBodies();
      this.bodies = null;
      TWP2.GameUtil.GetGameState().removeFromWorld(this);
      _super.prototype.destroy.call(this);
    };
    WorldObject.prototype.getDestroyTimer = function () {
      return this.destroyTimer;
    };
    WorldObject.prototype.getDestroyTimerMax = function () {
      return this.destroyTimerMax;
    };
    WorldObject.prototype.tick = function () {
      if (this.body) {
        this.x = this.body.x;
        this.y = this.body.y;
        if (!this.body.fixedRotation) {
          this.rotation = this.body.rotation;
        }
      }
      if (this.bDestroyTimerEnabled) {
        if (this.destroyTimer > 0) {
          this.destroyTimer--;
        } else {
          if (!this.bPendingDestroy) {
            this.bDestroyedByTimer = true;
          }
          this.triggerDestroy();
        }
      }
    };
    WorldObject.prototype.destroyedByTimer = function () {
      return this.bDestroyedByTimer;
    };
    WorldObject.prototype.onMatchEnded = function () {
      return;
    };
    WorldObject.prototype.onHit = function (_obj, _data) {
      return;
    };
    WorldObject.prototype.rotateAroundPoint = function (_x, _y, angle, _bodies) {
      var cosAngle = Math.cos(angle);
      var sinAngle = Math.sin(angle);
      for (var i = 0; i < _bodies.length; i++) {
        var body = _bodies[i];
        var distX = body.x - _x;
        var distY = body.y - _y;
        body.x = cosAngle * distX - sinAngle * distY + _x;
        body.y = cosAngle * distY + sinAngle * distX + _y;
        body.rotation = angle;
      }
    };
    WorldObject.prototype.addBody = function (_body, _data) {
      if (_data === void 0) {
        _data = null;
      }
      var obj = _data;
      if (!obj) {
        obj = {};
      }
      obj["worldObject"] = this;
      _body.data.SetUserData(obj);
      this.bodies.push(_body);
    };
    WorldObject.prototype.updateUserData = function (_body, _mc) {
      var obj = {};
      obj["worldObject"] = this;
      obj["mc"] = _mc;
      _body.data.SetUserData(obj);
    };
    WorldObject.prototype.destroyAllBodies = function () {
      while (this.bodies.length > 0) {
        this.removeBody(this.bodies[0]);
        this.bodies.splice(0, 1);
      }
      this.body = null;
    };
    WorldObject.prototype.bodyCallback = function (_body1, _body2, _fixture1, _fixture2, _begin, _contact) {
      if (!_begin) {
        return;
      }
      var objA = _body1.data.GetUserData() ? _body1.data.GetUserData()["worldObject"] : null;
      var objB = _body2.data.GetUserData() ? _body2.data.GetUserData()["worldObject"] : null;
      if (objA || objB) {
        //GameUtil.GetGameState().addCollisionToQueue(objA, objB);
        TWP2.GameUtil.GetGameState().addCollisionDataToQueue(_body1.data.GetUserData(), _body2.data.GetUserData());
      }
    };
    WorldObject.prototype.removeBody = function (_body) {
      if (!_body) {
        return;
      }
      if (_body.sprite) {
        _body.sprite.physicsEnabled = false;
        _body.sprite.destroy();
        _body.sprite = null;
      }
      TWP2.GameUtil.GetGameState().destroyBody(_body);
    };
    WorldObject.prototype.getBody = function () {
      return this.body;
    };
    WorldObject.prototype.triggerDestroy = function () {
      TWP2.GameUtil.GetGameState().flagObjectForDestruction(this);
    };
    WorldObject.prototype.enableDestroyTimer = function () {
      this.bDestroyTimerEnabled = true;
    };
    WorldObject.prototype.destroyTimerIsEnabled = function () {
      return this.bDestroyTimerEnabled;
    };
    WorldObject.prototype.setDestroyTimer = function (_seconds) {
      this.destroyTimer = Math.round(_seconds * 60);
      this.destroyTimerMax = this.destroyTimer;
    };
    WorldObject.prototype.setId = function (_val) {
      this.id = _val;
    };
    WorldObject.prototype.getId = function () {
      return this.id;
    };
    WorldObject.prototype.isPendingDestroy = function () {
      return this.bPendingDestroy;
    };
    WorldObject.prototype.setPendingDestroy = function () {
      this.bPendingDestroy = true;
      this.visible = false;
    };
    return WorldObject;
  })(Phaser.Group);
  TWP2.WorldObject = WorldObject;
  var Actor = /** @class */ (function (_super) {
    __extends(Actor, _super);
    function Actor(_id, _x, _y) {
      var _this = _super.call(this, _id, _x, _y) || this;
      _this.healthMax = 100;
      _this.health = 100;
      _this.damageMultiplier = 1;
      _this.forceMultiplier = 1;
      return _this;
    }
    Actor.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    Actor.prototype.getForceMultiplier = function () {
      return this.forceMultiplier;
    };
    Actor.prototype.setDamageMultiplier = function (_val) {
      this.damageMultiplier = _val;
    };
    Actor.prototype.takeDamage = function (_damageAmount, _instigator, _causer, _damageType, _bHeadshot) {
      this.onTakeDamage(_damageAmount, _instigator, _causer, _damageType, _bHeadshot);
      return _damageAmount;
    };
    Actor.prototype.onTakeDamage = function (_damageAmount, _instigator, _causer, _damageType, _bHeadshot) {
      if (!this.isAlive()) {
        return;
      }
      if (!TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
        return;
      }
      var realDamage = _damageAmount * this.damageMultiplier;
      if (_bHeadshot) {
        realDamage *= 2;
      }
      this.addHealth(-realDamage);
      if (this.health <= 0) {
        this.die(realDamage, _instigator, _causer, _damageType, _bHeadshot);
      }
    };
    Actor.prototype.die = function (_killingDamage, _killer, _causer, _damageType, _bHeadshot) {
      this.onDeath(_killingDamage, _killer, _causer, _damageType, _bHeadshot);
    };
    Actor.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
      if (_causer) {
        if (_causer instanceof Bullet) {
          var bullet = _causer;
          bullet.addKill();
        }
      }
    };
    Actor.prototype.addHealth = function (_val) {
      this.health = Math.max(0, Math.min(this.health + _val, this.healthMax));
    };
    Actor.prototype.getHealthMax = function () {
      return this.healthMax;
    };
    Actor.prototype.getHealth = function () {
      return this.health;
    };
    Actor.prototype.getHealthPercent = function () {
      return this.health / this.healthMax;
    };
    Actor.prototype.setHealthMax = function (_val) {
      this.healthMax = _val;
      this.health = _val;
    };
    Actor.prototype.isAlive = function () {
      return this.health > 0;
    };
    return Actor;
  })(WorldObject);
  TWP2.Actor = Actor;
  var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn(_id, _x, _y, _controller) {
      var _this = _super.call(this, _id, _x, _y) || this;
      _this.team = 0;
      _this.speed = 1;
      _this.xpReward = 5;
      _this.moneyReward = 0;
      _this.lookTarget = 0;
      _this.lookSpeed = 0.2;
      _this.bRegenHealth = true;
      _this.bWantsToMove = false;
      _this.bTargetable = true;
      _this.bBonus = false;
      _this.controller = _controller;
      if (_this.controller) {
        _this.controller.possess(_this);
      }
      if (_this.isPlayer()) {
        //...
      }
      TWP2.GameUtil.GetGameState().addToWorld(_this, TWP2.State_Game.INDEX_PAWNS);
      TWP2.GameUtil.GetGameState().onPawnAdded(_this);
      return _this;
    }
    Pawn.prototype.destroy = function () {
      TWP2.GameUtil.GetGameState().onPawnRemoved(this);
      this.onUnPossess();
      this.controller = null;
      _super.prototype.destroy.call(this);
    };
    Pawn.prototype.getHealthBarWidth = function () {
      return 50;
    };
    Pawn.prototype.setSpeed = function (_val) {
      this.speed = _val;
    };
    Pawn.prototype.getXPReward = function () {
      return this.xpReward;
    };
    Pawn.prototype.getMoneyReward = function () {
      return this.moneyReward;
    };
    Pawn.prototype.isBonus = function () {
      return this.bBonus;
    };
    Pawn.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
      _super.prototype.onDeath.call(this, _killingDamage, _instigator, _causer, _damageType, _bHeadshot);
      _instigator.onPawnKill(this.controller, _causer, _damageType, _bHeadshot);
    };
    Pawn.prototype.suicide = function () {
      this.takeDamage(this.healthMax, this.controller, this, TWP2.DamageType.DAMAGE_TYPE_WORLD, false);
    };
    Pawn.prototype.getSpeed = function () {
      return this.speed;
    };
    Pawn.prototype.updateHUD = function () {
      return;
    };
    Pawn.prototype.createBody = function () {
      return;
    };
    Pawn.prototype.createDeadBody = function () {
      return;
    };
    Pawn.prototype.onPossess = function (_controller) {
      this.controller = _controller;
      var bIsPlayer = _controller instanceof TWP2.PlayerController;
    };
    Pawn.prototype.onUnPossess = function () {
      if (this.controller && this.controller.getPawn() == this) {
        this.controller.unPossess();
      }
      this.controller = null;
    };
    Pawn.prototype.getController = function () {
      return this.controller;
    };
    Pawn.prototype.getPlayerController = function () {
      return this.controller instanceof TWP2.PlayerController ? this.controller : null;
    };
    Pawn.prototype.isPlayer = function () {
      return this.getPlayerController() != null;
    };
    Pawn.prototype.lookAt = function (_x, _y) {
      var distX = _x - this.x;
      var distY = _y - this.y;
      var angle = Math.atan2(distY, distX);
      this.lookTarget = angle;
      return angle;
    };
    Pawn.prototype.moveLeft = function () {
      if (this.body) {
        this.body.moveLeft(this.speed);
      }
    };
    Pawn.prototype.moveRight = function () {
      if (this.body) {
        this.body.moveRight(this.speed);
      }
    };
    Pawn.prototype.jump = function () {
      return;
    };
    return Pawn;
  })(Actor);
  TWP2.Pawn = Pawn;
  var Rope = /** @class */ (function (_super) {
    __extends(Rope, _super);
    function Rope(_x, _y, _type) {
      var _this = _super.call(this, null, _x, _y, 0) || this;
      _this.ropeType = _type;
      _this.createBody();
      _this.setDestroyTimer(5);
      return _this;
    }
    Rope.prototype.destroy = function () {
      this.rope = null;
      _super.prototype.destroy.call(this);
    };
    Rope.prototype.hide = function () {
      var tween = this.game.add.tween(this.rope).to({ alpha: TWP2.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Exponential.In, true);
      this.enableDestroyTimer();
      this.getBody().gravityScale = 1;
    };
    Rope.prototype.createBody = function () {
      if (this.ropeType == Rope.TYPE_DEFAULT) {
        this.rope = this.game.add.sprite(this.x, this.y, "atlas_objects", "rope_default");
        TWP2.GameUtil.GetGameState().addToWorld(this.rope, TWP2.State_Game.INDEX_WALLS);
      } else if (this.ropeType == Rope.TYPE_BASE) {
        var ropeHeight = Rope.HEIGHT;
        var gfx = this.game.add.graphics();
        gfx.beginFill(0x222222);
        gfx.lineStyle(1, 0x000000, 0.5);
        gfx.drawCircle(0, 0, ropeHeight);
        this.rope = this.game.add.sprite(this.x, this.y, gfx.generateTexture());
        TWP2.GameUtil.GetGameState().addToWorld(this.rope, TWP2.State_Game.INDEX_WALLS);
        gfx.destroy();
      } else if (this.ropeType == Rope.TYPE_HOLDER) {
        this.rope = this.game.add.sprite(this.x, this.y, "atlas_objects", "rope_holder");
        TWP2.GameUtil.GetGameState().addToWorld(this.rope, TWP2.State_Game.INDEX_WALLS);
      }
      this.game.physics.box2d.enable(this.rope, false);
      var ropeBody = this.rope.body;
      ropeBody.setCollisionCategory(TWP2.State_Game.CATEGORY_SHELLS);
      ropeBody.setCollisionMask(TWP2.State_Game.MASK_OBJECTS);
      ropeBody.linearDamping = 1;
      ropeBody.angularDamping = 1;
      //ropeBody.restitution = 1;
      //ropeBody.friction = 0.1;
      this.addBody(ropeBody);
      this.body = ropeBody;
    };
    Rope.TYPE_DEFAULT = "TYPE_DEFAULT";
    Rope.TYPE_HOLDER = "TYPE_HOLDER";
    Rope.TYPE_BASE = "TYPE_BASE";
    Rope.HEIGHT = 20;
    Rope.WIDTH = 5;
    return Rope;
  })(WorldObject);
  TWP2.Rope = Rope;
  var Harrier = /** @class */ (function (_super) {
    __extends(Harrier, _super);
    function Harrier(_id, _x, _y, _controller) {
      var _this = _super.call(this, _id, _x, _y, _controller) || this;
      _this.damage = 2;
      _this.fireRate = 10;
      _this.bWantsToFire = false;
      _this.bFireDelay = false;
      _this.bFireHandler = false;
      _this.speed = 20;
      _this.createBody();
      _this.xpReward = 50;
      _this.moneyReward = 100;
      _this.setHealthMax(800);
      _this.setDestroyTimer(3);
      _this.idleSfx = TWP2.SoundManager.PlayWorldSound("vehicle_harrier_idle", _this.x, _this.y, 0, 0, true);
      return _this;
    }
    Harrier.prototype.destroy = function () {
      if (this.idleSfx) {
        this.idleSfx.stop();
      }
      this.idleSfx = null;
      this.bodyPlane = null;
      this.weaponSprite = null;
      _super.prototype.destroy.call(this);
    };
    Harrier.prototype.getHealthBarWidth = function () {
      return 100;
    };
    Harrier.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.idleSfx) {
        this.idleSfx.volume = TWP2.SoundManager.GetVolForWorldPosition(this.x, this.y) * 0.1;
      }
      if (this.isAlive()) {
        this.weaponSprite.position.set(this.bodyPlane.sprite.x, this.bodyPlane.sprite.y);
        var desiredAngle = this.lookTarget;
        var target = this.weaponSprite.rotation - this.lookTarget;
        if (target > 180 * TWP2.MathUtil.TO_RADIANS) {
          target -= 360 * TWP2.MathUtil.TO_RADIANS;
        } else if (target < -180 * TWP2.MathUtil.TO_RADIANS) {
          target += 360 * TWP2.MathUtil.TO_RADIANS;
        }
        this.weaponSprite.rotation -= target * this.lookSpeed;
        if (this.bFireHandler) {
          this.fireHandler();
        }
        if (this.bFireDelay) {
          this.fireDelayHandler();
        }
      }
    };
    Harrier.prototype.addBulletHole = function () {
      if (TWP2.PlayerUtil.player.settings["bEffects"] == false) {
        return;
      }
      if (this.bPendingDestroy || !this.isAlive()) {
        return;
      }
      var sprite = this.bodyPlane.sprite;
      if (sprite) {
        var hole = this.game.add.image(0, 0, "atlas_objects", "decal_bullet_hole_default");
        hole.anchor.set(0.5, 0.5);
        hole.alpha = TWP2.MathUtil.Random(4, 8) * 0.1;
        var paddingX = hole.width;
        hole.x = TWP2.MathUtil.Random(paddingX, sprite.width - paddingX) - sprite.width * 0.5;
        var paddingY = hole.width + 20;
        hole.y = TWP2.MathUtil.Random(paddingY, sprite.height - paddingY) - sprite.height * 0.5;
        hole.rotation = TWP2.MathUtil.ToRad(TWP2.MathUtil.Random(0, 180));
        sprite.addChild(hole);
      }
    };
    Harrier.prototype.moveTo = function (_x, _y) {
      var angle = TWP2.MathUtil.Angle(this.x, this.y, _x, _y);
      var vx = Math.cos(angle);
      var vy = Math.sin(angle);
      var speed = this.speed;
      this.body.applyForce(speed * vx, speed * vy);
      this.body.angularVelocity += angle * 0.001;
    };
    Harrier.prototype.createBody = function () {
      var startX = this.x;
      var startY = this.y;
      var bodySprite = this.game.add.sprite(startX, startY + 30, "atlas_objects", "harrier");
      TWP2.GameUtil.GetGameState().addToWorld(bodySprite, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(bodySprite);
      bodySprite.body.setRectangleFromSprite(bodySprite);
      bodySprite.body.dynamic = true;
      bodySprite.body.gravityScale = 0;
      bodySprite.body.linearDamping = 1;
      bodySprite.body.angularDamping = 4;
      bodySprite.body.setCollisionCategory(TWP2.State_Game.CATEGORY_SOLDIERS);
      bodySprite.body.setCollisionMask(TWP2.State_Game.MASK_PAWNS);
      bodySprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_SOLDIERS, this.bodyCallback, this);
      bodySprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      this.addBody(bodySprite.body);
      this.bodyPlane = bodySprite.body;
      this.weaponSprite = this.game.add.sprite(bodySprite.x + bodySprite.width * 0.5, bodySprite.y + bodySprite.height * 0.5, "atlas_objects", "harrier_weapon");
      TWP2.GameUtil.GetGameState().addToWorld(this.weaponSprite, TWP2.State_Game.INDEX_PAWNS);
      this.body = bodySprite.body;
    };
    Harrier.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
      _super.prototype.onDeath.call(this, _killingDamage, _instigator, _causer, _damageType, _bHeadshot);
      if (this.bPendingDestroy) {
        return;
      }
      if (this.idleSfx) {
        this.idleSfx.stop();
        this.idleSfx = null;
      }
      TWP2.SoundManager.PlayWorldSound("explosion", this.x, this.y, 3);
      this.stopWeaponFire();
      this.weaponSprite.destroy();
      var gib1;
      var gib2;
      var gib3;
      var gibs = [];
      for (var i = 0; i < gibs.length; i++) {
        var gib = gibs[i];
        gib.getBody().applyForce(Math.min(5 * (_killingDamage * 0.5), 200), -TWP2.MathUtil.Random(50, 200) - TWP2.MathUtil.Random(0, _killingDamage) * 0.5);
      }
      for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        body.gravityScale = 1;
        body.setCollisionCategory(TWP2.State_Game.CATEGORY_SHELLS);
        body.setCollisionMask(TWP2.State_Game.MASK_WALLS);
        body.applyForce(TWP2.MathUtil.Random(5, 10), -TWP2.MathUtil.Random(25, 50));
        body.angularVelocity += TWP2.MathUtil.Random(5, 25) * TWP2.MathUtil.TO_RADIANS;
        var sprite = body.sprite;
        if (sprite) {
          var tween = this.game.add.tween(sprite).to({ alpha: TWP2.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Linear.None, true);
          TWP2.GameUtil.GetGameState().addToWorld(sprite, TWP2.State_Game.INDEX_WALLS);
        }
      }
      if (this.body) {
        this.body.applyForce(TWP2.MathUtil.Random(-20, 20), -TWP2.MathUtil.Random(0, 50));
      }
      this.enableDestroyTimer();
      TWP2.SoundManager.PlayWorldSound("physics_crate_open", this.x, this.y, 2, 0.2);
      if (_bHeadshot) {
        TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.5);
      }
    };
    Harrier.prototype.fireHandler = function () {
      if (!this.bWantsToFire) {
        this.bFireHandler = false;
      } else {
        if (this.canFire()) {
          this.fire();
          this.startFireDelay(this.fireRate);
        }
      }
    };
    Harrier.prototype.fireDelayHandler = function () {
      this.fireDelayTimer--;
      if (this.fireDelayTimer <= 0) {
        this.endFireDelay();
      }
    };
    Harrier.prototype.endFireDelay = function () {
      this.bFireDelay = false;
    };
    Harrier.prototype.fire = function () {
      var pos = this.getWorldMuzzlePosition();
      TWP2.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weaponSprite.rotation, undefined, 0.5);
      TWP2.SoundManager.PlayWorldSound("wpn_fire_harrier", this.x, this.y, 0, 0.5);
      var war = TWP2.GameUtil.GetGameState().getGameMode();
      if (war) {
        war.addDamage(this.damage, this);
      }
    };
    Harrier.prototype.getWorldMuzzlePosition = function () {
      var pos;
      if (!pos) {
        var offset = -this.weaponSprite.width * 0.5;
        var rot = this.weaponSprite.rotation + TWP2.MathUtil.ToRad(180);
        var startX = this.weaponSprite.x + Math.cos(rot) * offset;
        var startY = this.weaponSprite.y + Math.sin(rot) * offset;
        pos = new Phaser.Point(startX, startY);
      }
      return pos;
    };
    Harrier.prototype.canFire = function () {
      return !this.bFireDelay;
    };
    Harrier.prototype.startFireDelay = function (_delay) {
      this.bFireDelay = true;
      this.fireDelayTimer = _delay;
    };
    Harrier.prototype.startWeaponFire = function () {
      this.bWantsToFire = true;
      this.triggerFire();
    };
    Harrier.prototype.stopWeaponFire = function () {
      this.bWantsToFire = false;
    };
    Harrier.prototype.triggerFire = function () {
      this.bFireHandler = true;
    };
    Harrier.prototype.fireWeapon = function () {
      TWP2.GameUtil.GetGameState().createMuzzleFlash(this.weaponSprite.x, this.weaponSprite.y, this.weaponSprite.rotation);
    };
    return Harrier;
  })(Pawn);
  TWP2.Harrier = Harrier;
  var Soldier = /** @class */ (function (_super) {
    __extends(Soldier, _super);
    function Soldier(_id, _x, _y, _controller, _material, _weapon, _speed) {
      var _this = _super.call(this, _id, _x, _y, _controller) || this;
      _this.fireRate = 8;
      _this.damage = 1;
      _this.range = 500;
      _this.bWantsToFire = false;
      _this.bFireDelay = false;
      _this.bFireHandler = false;
      _this.setMaterial(_material);
      _this.setWeapon(_weapon);
      _this.createBody();
      _this.forceMultiplier = 0.2;
      _this.setDestroyTimer(3);
      TWP2.SoundManager.PlayWorldSound("physics_target_disappear", _this.x, _this.y, 0, 0.5);
      return _this;
    }
    Soldier.prototype.destroy = function () {
      this.bodyHead = null;
      this.bodyBody = null;
      this.bodyTread = null;
      this.bodyWheelL = null;
      this.bodyWheelR = null;
      this.joints = null;
      this.weaponSprite = null;
      _super.prototype.destroy.call(this);
    };
    Soldier.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.isAlive()) {
        this.weaponSprite.position.set(this.bodyBody.sprite.x + this.bodyBody.sprite.width * 0.25, this.bodyBody.sprite.y);
        var desiredAngle = this.lookTarget;
        var target = this.weaponSprite.rotation - this.lookTarget;
        if (target > 180 * TWP2.MathUtil.TO_RADIANS) {
          target -= 360 * TWP2.MathUtil.TO_RADIANS;
        } else if (target < -180 * TWP2.MathUtil.TO_RADIANS) {
          target += 360 * TWP2.MathUtil.TO_RADIANS;
        }
        this.weaponSprite.rotation -= target * this.lookSpeed;
        if (this.bFireHandler) {
          this.fireHandler();
        }
        if (this.bFireDelay) {
          this.fireDelayHandler();
        }
      }
    };
    Soldier.prototype.addBulletHole = function (_bHeadshot) {
      if (TWP2.PlayerUtil.player.settings["bEffects"] == false) {
        return;
      }
      if (this.bPendingDestroy || !this.isAlive()) {
        return;
      }
      var sprite = _bHeadshot ? this.bodyHead.sprite : this.bodyBody.sprite;
      if (sprite) {
        var hole = this.game.add.image(0, 0, "atlas_objects", "decal_bullet_hole_" + this.targetMaterial);
        hole.anchor.set(0.5, 0.5);
        hole.alpha = TWP2.MathUtil.Random(4, 8) * 0.1;
        var padding = hole.width * (_bHeadshot ? 0.8 : 0.6);
        hole.x = TWP2.MathUtil.Random(padding, sprite.width - padding) - sprite.width * 0.5;
        hole.y = TWP2.MathUtil.Random(padding, sprite.height - padding) - sprite.height * 0.5;
        hole.rotation = TWP2.MathUtil.ToRad(TWP2.MathUtil.Random(0, 180));
        sprite.addChild(hole);
      }
    };
    Soldier.prototype.setWeapon = function (_val) {
      this.targetWeapon = _val;
      if (this.targetWeapon == Soldier.WEAPON_DEFAULT) {
        this.damage = 1;
        this.fireRate = 6;
        this.fireSfx = TWP2.WeaponDatabase.WEAPON_M60E4;
        this.range = 450;
      } else if (this.targetWeapon == Soldier.WEAPON_SNIPER) {
        this.damage = 10;
        this.fireRate = 90;
        this.fireSfx = TWP2.WeaponDatabase.WEAPON_MB13;
        this.range = 750;
      }
    };
    Soldier.prototype.getRange = function () {
      return this.range;
    };
    Soldier.prototype.setMaterial = function (_val) {
      this.targetMaterial = _val;
      if (this.targetMaterial == Target.MATERIAL_METAL) {
        this.setHealthMax(600);
        this.xpReward = 10;
      }
    };
    Soldier.prototype.getMaterial = function () {
      return this.targetMaterial;
    };
    Soldier.prototype.getMaterialString = function () {
      if (!this.targetMaterial || this.targetMaterial == Target.MATERIAL_DEFAULT) {
        return "";
      }
      return "_" + this.targetMaterial;
    };
    Soldier.prototype.fireHandler = function () {
      if (!this.bWantsToFire) {
        this.bFireHandler = false;
      } else {
        if (this.canFire()) {
          this.fire();
          this.startFireDelay(this.fireRate);
        }
      }
    };
    Soldier.prototype.fireDelayHandler = function () {
      this.fireDelayTimer--;
      if (this.fireDelayTimer <= 0) {
        this.endFireDelay();
      }
    };
    Soldier.prototype.endFireDelay = function () {
      this.bFireDelay = false;
    };
    Soldier.prototype.fire = function () {
      var pos = this.getWorldMuzzlePosition();
      TWP2.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weaponSprite.rotation, undefined, 0.5);
      TWP2.SoundManager.PlayWorldSound("wpn_fire_" + this.fireSfx, this.x, this.y, 0, 0.5);
      var war = TWP2.GameUtil.GetGameState().getGameMode();
      if (war) {
        war.addDamage(this.damage, this);
      }
    };
    Soldier.prototype.getWorldMuzzlePosition = function () {
      var pos;
      if (!pos) {
        var offset = -this.weaponSprite.width * 0.5;
        var rot = this.weaponSprite.rotation + TWP2.MathUtil.ToRad(180);
        var startX = this.weaponSprite.x + Math.cos(rot) * offset;
        var startY = this.weaponSprite.y + Math.sin(rot) * offset;
        pos = new Phaser.Point(startX, startY);
      }
      return pos;
    };
    Soldier.prototype.canFire = function () {
      return !this.bFireDelay;
    };
    Soldier.prototype.startFireDelay = function (_delay) {
      this.bFireDelay = true;
      this.fireDelayTimer = _delay;
    };
    Soldier.prototype.startWeaponFire = function () {
      this.bWantsToFire = true;
      this.triggerFire();
    };
    Soldier.prototype.stopWeaponFire = function () {
      this.bWantsToFire = false;
    };
    Soldier.prototype.triggerFire = function () {
      this.bFireHandler = true;
    };
    Soldier.prototype.getBodyTread = function () {
      return this.bodyTread;
    };
    Soldier.prototype.fireWeapon = function () {
      TWP2.GameUtil.GetGameState().createMuzzleFlash(this.weaponSprite.x, this.weaponSprite.y, this.weaponSprite.rotation);
    };
    Soldier.prototype.setMotorEnabled = function (_bVal) {
      if (this.isAlive()) {
        if (this.joints) {
          this.joints[2].m_enableMotor = _bVal;
          this.joints[3].m_enableMotor = _bVal;
          if (_bVal) {
            this.bodyTread.applyForce(-20, 12);
          }
        }
      }
    };
    Soldier.prototype.createBody = function () {
      var startX = this.x;
      var startY = this.y;
      var materialString = this.getMaterialString();
      var bodySprite = this.game.add.sprite(startX, startY + 30, "atlas_objects", "soldier_body" + materialString);
      TWP2.GameUtil.GetGameState().addToWorld(bodySprite, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(bodySprite);
      bodySprite.body.setRectangleFromSprite(bodySprite);
      bodySprite.body.dynamic = true;
      bodySprite.body.linearDamping = 8;
      bodySprite.body.angularDamping = 20;
      bodySprite.body.setCollisionCategory(TWP2.State_Game.CATEGORY_SOLDIERS);
      bodySprite.body.setCollisionMask(TWP2.State_Game.MASK_PAWNS);
      bodySprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_SOLDIERS, this.bodyCallback, this);
      bodySprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      this.addBody(bodySprite.body);
      this.bodyBody = bodySprite.body;
      var treadSprite = this.game.add.sprite(startX, bodySprite.y + 30, "atlas_objects", "soldier_tread");
      TWP2.GameUtil.GetGameState().addToWorld(treadSprite, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(treadSprite);
      //treadSprite.body.setRectangleFromSprite(treadSprite);
      treadSprite.body.setRectangle(treadSprite.width, treadSprite.height * 0.75);
      treadSprite.body.dynamic = true;
      treadSprite.body.linearDamping = 8;
      treadSprite.body.angularDamping = 20;
      treadSprite.body.setCollisionCategory(TWP2.State_Game.CATEGORY_SOLDIERS);
      treadSprite.body.setCollisionMask(TWP2.State_Game.MASK_OBJECTS);
      treadSprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_SOLDIERS, this.bodyCallback, this);
      treadSprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      this.addBody(treadSprite.body);
      this.bodyTread = treadSprite.body;
      var headSprite = this.game.add.sprite(startX, startY - 30, "atlas_objects", "soldier_head" + materialString);
      TWP2.GameUtil.GetGameState().addToWorld(headSprite, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(headSprite);
      headSprite.body.setCircle(10);
      headSprite.body.dynamic = true;
      headSprite.body.linearDamping = 1;
      headSprite.body.angularDamping = 2;
      headSprite.body.setCollisionCategory(TWP2.State_Game.CATEGORY_SOLDIERS);
      headSprite.body.setCollisionMask(TWP2.State_Game.MASK_PAWNS);
      headSprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_SOLDIERS, this.bodyCallback, this);
      headSprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      this.addBody(headSprite.body, { bHead: true });
      this.bodyHead = headSprite.body;
      var wheelTorque = 10000;
      var wheelSpeed = -TWP2.MathUtil.Random(100, 300);
      var wheelRight = this.game.add.sprite(startX, startY, "atlas_objects", "soldier_wheel_large");
      TWP2.GameUtil.GetGameState().addToWorld(wheelRight, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(wheelRight);
      wheelRight.body.setCircle(15);
      wheelRight.body.dynamic = true;
      wheelRight.body.linearDamping = 1;
      wheelRight.body.angularDamping = 1;
      wheelRight.body.setCollisionCategory(TWP2.State_Game.CATEGORY_SOLDIERS);
      wheelRight.body.setCollisionMask(TWP2.State_Game.MASK_WALLS);
      wheelRight.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_SOLDIERS, this.bodyCallback, this);
      wheelRight.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      //bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
      var jointWheelR = this.game.physics.box2d.revoluteJoint(wheelRight, treadSprite, 0, 0, treadSprite.width * 0.5, 0, wheelSpeed, wheelTorque, false);
      this.bodyWheelR = wheelRight.body;
      this.addBody(wheelRight.body);
      var wheelLeft = this.game.add.sprite(startX, startY, "atlas_objects", "soldier_wheel_small");
      TWP2.GameUtil.GetGameState().addToWorld(wheelLeft, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(wheelLeft);
      wheelLeft.body.setCircle(10);
      wheelLeft.body.dynamic = true;
      wheelLeft.body.linearDamping = 1;
      wheelLeft.body.angularDamping = 1;
      wheelLeft.body.setCollisionCategory(TWP2.State_Game.CATEGORY_SOLDIERS);
      wheelLeft.body.setCollisionMask(TWP2.State_Game.MASK_WALLS);
      wheelLeft.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_SOLDIERS, this.bodyCallback, this);
      wheelLeft.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      //bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
      var jointWheelL = this.game.physics.box2d.revoluteJoint(wheelLeft, treadSprite, 0, 0, -treadSprite.width * 0.5, 0, wheelSpeed, wheelTorque, false);
      this.bodyWheelL = wheelLeft.body;
      this.addBody(wheelLeft.body);
      this.weaponSprite = this.game.add.sprite(bodySprite.x + bodySprite.width * 0.5, bodySprite.y + bodySprite.height * 0.5, "atlas_objects", "soldier_weapon_" + this.targetWeapon);
      TWP2.GameUtil.GetGameState().addToWorld(this.weaponSprite, TWP2.State_Game.INDEX_PAWNS);
      var jointHead = this.game.physics.box2d.revoluteJoint(bodySprite, headSprite, 0, -bodySprite.height * 0.5, 0, headSprite.height * 0.5, 0, -1, 5, -5, 2, true);
      var jointTread = this.game.physics.box2d.revoluteJoint(bodySprite, treadSprite, 0, bodySprite.height * 0.5 - 2, 0, -treadSprite.height * 0.5, -100, 100, true, -10, 1, true);
      this.joints = [jointHead, jointTread, jointWheelL, jointWheelR];
      this.body = headSprite.body;
      if (this.targetMaterial == Target.MATERIAL_DEFAULT) {
        if (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.RankedGameMode) {
          if (TWP2.MathUtil.Random(1, 20) == 1) {
            bodySprite.tint = Phaser.Color.linearInterpolation([0xffffff, TWP2.ColourUtil.COLOUR_GREEN], 0.5);
            this.xpReward = 25;
            this.bBonus = true;
            var star = this.game.add.image(0, -4, "atlas_ui", "icon_star");
            star.scale.set(0.5, 0.5);
            star.alpha = 0.5;
            star.anchor.set(0.5, 0.5);
            bodySprite.addChild(star);
          } else if (TWP2.MathUtil.Random(1, 20) == 1) {
            bodySprite.tint = Phaser.Color.linearInterpolation([0xffffff, TWP2.ColourUtil.COLOUR_MONEY], 0.5);
            this.moneyReward = 100;
            var coin = this.game.add.image(0, -4, "atlas_ui", "icon_buy");
            coin.scale.set(0.5, 0.5);
            coin.alpha = 0.5;
            coin.anchor.set(0.5, 0.5);
            bodySprite.addChild(coin);
          }
        }
        headSprite.tint = bodySprite.tint;
      }
    };
    Soldier.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
      _super.prototype.onDeath.call(this, _killingDamage, _instigator, _causer, _damageType, _bHeadshot);
      if (this.bPendingDestroy) {
        return;
      }
      this.stopWeaponFire();
      this.weaponSprite.destroy();
      //this.removeBody(this.bodyWheelL);
      //this.removeBody(this.bodyWheelR);
      for (var i = 0; i < this.joints.length; i++) {
        TWP2.GameUtil.GetGameState().destroyJoint(this.joints[i]);
      }
      var gib1;
      var gib2;
      var gib3;
      var tintColour = this.body.sprite.tint;
      if (_bHeadshot) {
        this.removeBody(this.bodyHead);
      } else {
        /*
              gib1 = GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_1);
              gib2 = GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_2);
              gib3 = GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_3);
              this.removeBody(this.bodyBody);
              */
      }
      var gibs = [];
      for (var i = 0; i < gibs.length; i++) {
        var gib = gibs[i];
        gib.getBody().sprite.tint = tintColour;
        gib.getBody().applyForce(Math.min(5 * (_killingDamage * 0.5), 200), -TWP2.MathUtil.Random(50, 200) - TWP2.MathUtil.Random(0, _killingDamage) * 0.5);
      }
      //this.destroyAllBodies();
      for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        body.setCollisionCategory(TWP2.State_Game.CATEGORY_SHELLS);
        body.setCollisionMask(TWP2.State_Game.MASK_WALLS);
        body.applyForce(TWP2.MathUtil.Random(5, 10), -TWP2.MathUtil.Random(25, 50));
        body.angularVelocity += TWP2.MathUtil.Random(5, 25) * TWP2.MathUtil.TO_RADIANS;
        var sprite = body.sprite;
        if (sprite) {
          var tween = this.game.add.tween(sprite).to({ alpha: TWP2.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Linear.None, true);
          TWP2.GameUtil.GetGameState().addToWorld(sprite, TWP2.State_Game.INDEX_WALLS);
        }
      }
      this.enableDestroyTimer();
      TWP2.SoundManager.PlayWorldSound("physics_crate_open", this.x, this.y, 2, 0.2);
      if (_bHeadshot) {
        TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.5);
        TWP2.SoundManager.PlayWorldSound("physics_target_headshot_hard", this.x, this.y);
      }
    };
    Soldier.WEAPON_DEFAULT = "default";
    Soldier.WEAPON_SNIPER = "sniper";
    return Soldier;
  })(Pawn);
  TWP2.Soldier = Soldier;
  var Target = /** @class */ (function (_super) {
    __extends(Target, _super);
    function Target(_id, _x, _y, _controller, _type, _material) {
      var _this = _super.call(this, _id, _x, _y, _controller) || this;
      _this.targetType = null;
      _this.targetMaterial = null;
      _this.setMaterial(_material);
      _this.setType(_type);
      _this.createBody();
      _this.setDestroyTimer(5);
      return _this;
    }
    Target.prototype.destroy = function () {
      if (this.ropeBaseJoint) {
        TWP2.GameUtil.GetGameState().destroyJoint(this.ropeBaseJoint);
      }
      this.ropeBaseJoint = null;
      if (this.ropes) {
        this.hideRopes();
      }
      this.ropes = null;
      this.bodyHead = null;
      this.bodyBody = null;
      this.jointHead = null;
      _super.prototype.destroy.call(this);
    };
    Target.prototype.triggerDestroy = function () {
      if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
        if (this.bDestroyedByTimer && this.isAlive()) {
          if (TWP2.GameUtil.GetGameState().getGameMode().tracksMissedTargets()) {
            TWP2.SoundManager.PlayWorldSound("physics_target_disappear", this.x, this.y, 0, 0.5);
            TWP2.GameUtil.GetGameState().createSmoke(this.x, this.y, TWP2.MathUtil.ToRad(-90), Smoke.SMOKE_TARGET);
            TWP2.GameUtil.GetGameState().getGameMode().addTargetMissed();
          }
        }
      }
      _super.prototype.triggerDestroy.call(this);
    };
    Target.prototype.addBulletHole = function (_bHeadshot) {
      if (TWP2.PlayerUtil.player.settings["bEffects"] == false) {
        return;
      }
      if (this.bPendingDestroy || !this.isAlive()) {
        return;
      }
      var sprite = _bHeadshot ? this.bodyHead.sprite : this.bodyBody.sprite;
      if (sprite) {
        var hole = this.game.add.image(0, 0, "atlas_objects", "decal_bullet_hole_" + this.targetMaterial);
        hole.anchor.set(0.5, 0.5);
        hole.alpha = TWP2.MathUtil.Random(4, 8) * 0.1;
        var padding = hole.width * (_bHeadshot ? 0.8 : 0.6);
        hole.x = TWP2.MathUtil.Random(padding, sprite.width - padding) - sprite.width * 0.5;
        hole.y = TWP2.MathUtil.Random(padding, sprite.height - padding) - sprite.height * 0.5;
        hole.rotation = TWP2.MathUtil.ToRad(TWP2.MathUtil.Random(0, 180));
        sprite.addChild(hole);
        if (TWP2.MathUtil.Random(1, 3) == 1) {
          TWP2.GameUtil.GetGameState().createDebris(sprite.x, sprite.y, this.rotation, this.targetMaterial == Target.MATERIAL_DEFAULT ? Debris.DEBRIS_TARGET_DEFAULT : Debris.DEBRIS_TARGET_METAL);
        }
      }
    };
    Target.prototype.setMaterial = function (_val) {
      this.targetMaterial = _val;
      if (this.targetMaterial == Target.MATERIAL_METAL) {
        this.setHealthMax(650);
        this.xpReward = 10;
        this.forceMultiplier = 0.5;
      }
    };
    Target.prototype.getMaterial = function () {
      return this.targetMaterial;
    };
    Target.prototype.getMaterialString = function () {
      if (!this.targetMaterial || this.targetMaterial == Target.MATERIAL_DEFAULT) {
        return "";
      }
      return "_" + this.targetMaterial;
    };
    Target.prototype.setType = function (_val) {
      this.targetType = _val;
      if (this.targetType == Target.TYPE_ATTACKER) {
        var defender = TWP2.GameUtil.GetGameState().getGameMode();
        this.speed = TWP2.MathUtil.Random(defender.getSpeedMin(), defender.getSpeedMax()) * 0.1;
      }
    };
    Target.prototype.getType = function () {
      return this.targetType;
    };
    Target.prototype.setRopeBaseJoint = function (_joint) {
      this.ropeBaseJoint = _joint;
    };
    Target.prototype.setRopes = function (_ropes) {
      this.ropes = _ropes;
    };
    Target.prototype.hideRopes = function () {
      this.ropes[0].getBody().static = false;
      for (var i = 0; i < this.ropes.length; i++) {
        this.ropes[i].hide();
      }
      this.ropes = null;
    };
    Target.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      TWP2.SoundManager.PlayWorldSound("physics_target_hit", this.x, this.y, 5, 0.1);
      if (this.targetType == Target.TYPE_LAVA) {
        if (this.isAlive() && this.y > this.game.world.height * 0.8) {
          if (!_obj) {
            if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
              this.suicide();
              var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
              if (gameMode instanceof TWP2.GameMode_Lava) {
                var lava = gameMode;
                lava.addMissedLavaTarget();
                TWP2.GameUtil.GetGameState().shakeCamera(10);
                TWP2.SoundManager.PlayWorldSound("explosion", this.x, this.y, 3);
              }
            }
          }
        }
      }
    };
    Target.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
      _super.prototype.onDeath.call(this, _killingDamage, _instigator, _causer, _damageType, _bHeadshot);
      if (this.bPendingDestroy) {
        return;
      }
      this.setGravityScale(1);
      TWP2.GameUtil.GetGameState().destroyJoint(this.jointHead);
      var gib1;
      var gib2;
      var gib3;
      var tintColour = this.body.sprite.tint;
      var material = this.getMaterialString();
      if (_bHeadshot || !this.bodyBody) {
        gib1 = TWP2.GameUtil.GetGameState().createDebris(this.bodyHead.x, this.bodyHead.y, this.bodyHead.rotation, Debris.DEBRIS_TARGET_HEAD_GIB_1 + material);
        gib2 = TWP2.GameUtil.GetGameState().createDebris(this.bodyHead.x, this.bodyHead.y, this.bodyHead.rotation, Debris.DEBRIS_TARGET_HEAD_GIB_2 + material);
        gib3 = TWP2.GameUtil.GetGameState().createDebris(this.bodyHead.x, this.bodyHead.y, this.bodyHead.rotation, Debris.DEBRIS_TARGET_HEAD_GIB_3 + material);
        this.removeBody(this.bodyHead);
      } else {
        gib1 = TWP2.GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_1 + material);
        gib2 = TWP2.GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_2 + material);
        gib3 = TWP2.GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_3 + material);
        this.removeBody(this.bodyBody);
      }
      var gibs = [gib1, gib2, gib3];
      for (var i = 0; i < gibs.length; i++) {
        var gib = gibs[i];
        if (gib) {
          gib.getBody().sprite.tint = tintColour;
          gib.getBody().applyForce(Math.min(5 * (_killingDamage * 0.5), 200), -TWP2.MathUtil.Random(50, 200) - TWP2.MathUtil.Random(0, _killingDamage) * 0.5);
        }
      }
      //this.destroyAllBodies();
      for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        body.setCollisionCategory(TWP2.State_Game.CATEGORY_SHELLS);
        body.setCollisionMask(TWP2.State_Game.MASK_OBJECTS);
        body.applyForce(TWP2.MathUtil.Random(5, 10), -TWP2.MathUtil.Random(25, 50));
        body.angularVelocity += TWP2.MathUtil.Random(5, 25) * TWP2.MathUtil.TO_RADIANS;
        var sprite = body.sprite;
        if (sprite) {
          var tween = this.game.add.tween(sprite).to({ alpha: TWP2.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Linear.None, true);
          TWP2.GameUtil.GetGameState().addToWorld(sprite, TWP2.State_Game.INDEX_WALLS);
        }
      }
      this.enableDestroyTimer();
      TWP2.SoundManager.PlayWorldSound("physics_crate_open", this.x, this.y, 2, 0.2);
      if (_bHeadshot) {
        TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.5);
        TWP2.SoundManager.PlayWorldSound("physics_target_headshot_hard", this.x, this.y);
      }
      if (this.ropes) {
        this.hideRopes();
      }
      if (this.ropeBaseJoint) {
        this.ropeBaseJoint.EnableMotor(false);
        this.ropeBaseJoint = null;
      }
    };
    Target.prototype.createBody = function () {
      var startX = this.x;
      var startY = this.y;
      var material = this.getMaterialString();
      if (this.targetType != Target.TYPE_ATTACKER) {
        var bodySprite = this.game.add.sprite(startX, startY + 30, "atlas_objects", "target_body" + material);
        TWP2.GameUtil.GetGameState().addToWorld(bodySprite, TWP2.State_Game.INDEX_PAWNS);
        this.game.physics.box2d.enable(bodySprite);
        bodySprite.body.setRectangleFromSprite(bodySprite);
        bodySprite.body.dynamic = true;
        bodySprite.body.linearDamping = 2;
        bodySprite.body.angularDamping = 1;
        bodySprite.body.setCollisionCategory(TWP2.State_Game.CATEGORY_OBJECTS);
        bodySprite.body.setCollisionMask(TWP2.State_Game.MASK_PAWNS);
        bodySprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
        bodySprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        this.addBody(bodySprite.body);
        this.bodyBody = bodySprite.body;
      }
      var headSprite = this.game.add.sprite(startX, startY - 30, "atlas_objects", "target_head" + material);
      TWP2.GameUtil.GetGameState().addToWorld(headSprite, TWP2.State_Game.INDEX_PAWNS);
      this.game.physics.box2d.enable(headSprite);
      headSprite.body.setCircle(14);
      headSprite.body.dynamic = true;
      headSprite.body.linearDamping = this.targetMaterial == Target.MATERIAL_METAL ? 4 : 1;
      headSprite.body.angularDamping = 1;
      headSprite.body.setCollisionCategory(TWP2.State_Game.CATEGORY_OBJECTS);
      headSprite.body.setCollisionMask(TWP2.State_Game.MASK_PAWNS);
      headSprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
      headSprite.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      this.addBody(headSprite.body, { bHead: true });
      this.bodyHead = headSprite.body;
      if (this.targetType == Target.TYPE_ATTACKER) {
        this.bodyHead.gravityScale = 0;
        this.bodyHead.linearDamping = 5;
        this.bodyHead.angularDamping = 2;
      } else if (this.targetType == Target.TYPE_LAVA) {
        this.setGravityScale(TWP2.MathUtil.Random(15, 25) * 0.01);
      }
      if (this.targetMaterial == Target.MATERIAL_DEFAULT) {
        if (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.RankedGameMode) {
          if (TWP2.MathUtil.Random(1, 20) == 1) {
            this.xpReward = 25;
            this.bBonus = true;
            var tintColour = Phaser.Color.linearInterpolation([0xffffff, TWP2.ColourUtil.COLOUR_GREEN], 0.5);
            var star = this.game.add.image(0, 0, "atlas_ui", "icon_star");
            star.alpha = 0.5;
            star.anchor.set(0.5, 0.5);
            if (bodySprite) {
              bodySprite.tint = tintColour;
              star.y = -4;
              bodySprite.addChild(star);
            } else {
              headSprite.tint = tintColour;
              star.scale.set(0.75, 0.75);
              headSprite.addChild(star);
            }
          } else if (TWP2.MathUtil.Random(1, 20) == 1) {
            this.moneyReward = 100;
            var tintColour = Phaser.Color.linearInterpolation([0xffffff, TWP2.ColourUtil.COLOUR_MONEY], 0.5);
            var coin = this.game.add.image(0, 0, "atlas_ui", "icon_buy");
            coin.alpha = 0.5;
            coin.anchor.set(0.5, 0.5);
            if (bodySprite) {
              bodySprite.tint = tintColour;
              coin.y = -4;
              bodySprite.addChild(coin);
            } else {
              headSprite.tint = tintColour;
              coin.scale.set(0.75, 0.75);
              headSprite.addChild(coin);
            }
          }
        }
      }
      if (bodySprite) {
        headSprite.tint = bodySprite.tint;
        this.jointHead = this.game.physics.box2d.revoluteJoint(bodySprite, headSprite, 0, -bodySprite.height * 0.5, 0, headSprite.height * 0.5, 0, 0, 0, -5, 5, true);
      }
      this.body = headSprite.body;
    };
    Target.prototype.getBodyHead = function () {
      return this.bodyHead;
    };
    Target.prototype.getBodyBody = function () {
      return this.bodyBody;
    };
    Target.prototype.setGravityScale = function (_val) {
      if (this.bodyHead) {
        this.bodyHead.gravityScale = _val;
      }
      if (this.bodyBody) {
        this.bodyBody.gravityScale = _val;
      }
    };
    Target.prototype.moveTo = function (_x, _y) {
      var angle = TWP2.MathUtil.Angle(this.x, this.y, _x, _y);
      var vx = Math.cos(angle);
      var vy = Math.sin(angle);
      var speed = this.speed;
      this.body.applyForce(speed * vx, speed * vy);
      this.body.angularVelocity += angle * 0.01;
    };
    Target.TYPE_DEFAULT = "default";
    Target.TYPE_LAVA = "lava";
    Target.TYPE_ROPE = "rope";
    Target.TYPE_ATTACKER = "attacker";
    Target.TYPE_ROTATOR = "rail";
    Target.MATERIAL_METAL = "metal";
    Target.MATERIAL_DEFAULT = "default";
    return Target;
  })(Pawn);
  TWP2.Target = Target;
  var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(_id, _x, _y, _controller) {
      var _this = _super.call(this, _id, _x, _y, _controller) || this;
      _this.moveModifier = 1;
      _this.currentClassIndex = -1;
      _this.currentInventoryIndex = 0;
      _this.desiredLaserAlpha = Character.LASER_ALPHA_DEFAULT;
      _this.desiredX = 0;
      _this.desiredY = 0;
      _this.recoilCooldownSpeed = 1;
      _this.bWantsToSprint = false;
      _this.bWantsToFire = false;
      _this.bFireHandler = false;
      _this.bBurstFireHandler = false;
      _this.bFireDelay = false;
      _this.bIsReloading = false;
      _this.bUnlimitedAmmo = true;
      _this.bLaserEnabled = true;
      _this.bShadowEnabled = true;
      _this.weapon = _this.game.add.group();
      _this.addChild(_this.weapon);
      _this.laser = _this.game.add.graphics();
      TWP2.GameUtil.GetGameState().addToWorld(_this.laser, TWP2.State_Game.INDEX_LASER);
      _this.skills = [];
      _this.modifiers = {};
      _this.resetModifiers();
      if (TWP2.GameUtil.GetGameState().getGameMode() instanceof TWP2.RankedGameMode) {
        var skills = TWP2.PlayerUtil.player["skills"];
        _this.modifiers[Character.MODIFIER_RELOAD_SPEED] = 1 - skills["reload"] * 0.05;
        _this.modifiers[Character.MODIFIER_RECOIL] = 1 - skills["recoil"] * 0.01;
        _this.modifiers[Character.MODIFIER_RECOIL_RECOVERY] = 1 - skills["recoil"] * 0.05;
        _this.modifiers[Character.MODIFIER_VIEW_SPEED] = 1 + skills["aim"] * 0.25;
      }
      _this.inventory = [];
      _this.lastWeaponPosition = new Phaser.Point(_this.weapon.x, _this.weapon.y);
      return _this;
    }
    Character.prototype.destroy = function () {
      this.blurX = null;
      this.blurY = null;
      this.weapon = null;
      this.shadow = null;
      this.skills = null;
      this.recoilTween = null;
      this.slideTween = null;
      this.inventory = null;
      this.modifiers = null;
      this.lastWeaponPosition = null;
      this.foleySound = null;
      this.laser = null;
      _super.prototype.destroy.call(this);
    };
    Character.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.isAlive()) {
        if (this.weapon) {
          this.updateLookSpeed();
          var desiredAngle = this.lookTarget;
          var target = this.weapon.rotation - this.lookTarget;
          if (target > 180 * TWP2.MathUtil.TO_RADIANS) {
            target -= 360 * TWP2.MathUtil.TO_RADIANS;
          } else if (target < -180 * TWP2.MathUtil.TO_RADIANS) {
            target += 360 * TWP2.MathUtil.TO_RADIANS;
          }
          var dif = Math.abs(this.weapon.rotation - this.lookTarget);
          if (dif > 0.5) {
            this.triggerFoleySound();
          }
          var lookSpeed = this.lookSpeed;
          var recoilLookModifier = 1;
          if (this.recoilCooldownSpeed > 1) {
            this.recoilCooldownSpeed--;
            recoilLookModifier = Math.max(0.1, 1 - this.recoilCooldownSpeed * 0.05 * this.modifiers[Character.MODIFIER_RECOIL_RECOVERY]);
          } else {
            lookSpeed *= this.modifiers[Character.MODIFIER_VIEW_SPEED];
          }
          var useSpeed = Math.max(0.01, lookSpeed * recoilLookModifier);
          this.weapon.rotation -= target * useSpeed;
          this.laser.clear();
          this.x -= (this.x - this.desiredX) * 0.1;
          this.y -= (this.y - this.desiredY) * 0.1;
          if (this.bLaserEnabled) {
            if (this.desiredLaserAlpha > 0) {
              var muzzlePos = this.getWorldLaserPosition(); //this.getWorldMuzzlePosition();
              var dist = 1500;
              var rad = this.rotation + this.weapon.rotation;
              var startX = muzzlePos.x + this.weapon.x;
              var startY = muzzlePos.y + this.weapon.y;
              var endX = this.x + Math.cos(rad) * dist;
              var endY = this.y + Math.sin(rad) * dist;
              var filterFunc = TWP2.State_Game.FilterRaycastHit;
              var raycast = this.game.physics.box2d.raycast(startX, startY, endX, endY, false, TWP2.State_Game.FilterRaycastHit);
              if (raycast.length > 0) {
                var hit = raycast[0];
                endX = hit.point.x;
                endY = hit.point.y;
                endY = hit.point.y;
              }
              this.laser.alpha = this.desiredLaserAlpha;
              var laserColour = 0xff0000;
              this.laser.lineStyle(1, 0xffffff, 1);
              this.laser.moveTo(startX, startY);
              this.laser.lineTo(endX, endY);
              this.laser.lineStyle(5, laserColour, 0.25);
              this.laser.moveTo(startX, startY);
              this.laser.lineTo(endX, endY);
              this.laser.endFill();
              this.laser.beginFill(0xffffff, 1);
              this.laser.drawCircle(endX, endY, 6);
            }
          }
          if (this.shadow) {
            var offset = 32;
            this.shadow.x = this.x + this.weapon.x + offset;
            this.shadow.y = this.y + this.weapon.y + offset;
            this.shadow.rotation = this.rotation + this.weapon.rotation;
            this.shadow.scale.y = this.weapon.scale.y * 0.8;
          }
        }
        if (this.bFireHandler) {
          this.fireHandler();
        }
        if (this.bBurstFireHandler) {
          this.burstFireHandler();
        }
        if (this.bFireDelay) {
          this.fireDelayHandler();
        }
        if (this.bIsReloading) {
          this.reloadHandler();
        }
      }
      this.updateBlur();
      this.lastWeaponPosition.x = this.weapon.x;
      this.lastWeaponPosition.y = this.weapon.y;
    };
    Character.prototype.triggerFoleySound = function () {
      if (!this.foleySound) {
        this.foleySound = TWP2.SoundManager.PlayWorldSound("wpn_foley", this.x, this.y, 3, 0.3);
        if (this.foleySound) {
          this.foleySound.onStop.addOnce(this.onFoleySoundStop, this);
        }
      }
    };
    Character.prototype.onFoleySoundStop = function () {
      this.foleySound = null;
    };
    Character.prototype.updateBlur = function () {
      var bBlurEnabled = false;
      if (bBlurEnabled) {
        if (!this.blurX) {
          this.blurX = TWP2.GameUtil.game.add.filter("BlurX");
        }
        if (!this.blurY) {
          this.blurY = TWP2.GameUtil.game.add.filter("BlurY");
        }
        var difX = Math.abs(Math.min(this.lastWeaponPosition.x, 0));
        var difY = Math.abs(Math.min(this.lastWeaponPosition.y, 0));
        var dif = (difX + difY) * 1.2;
        var maxBlur = 8;
        var minBlur = 4;
        var rot = this.weapon.rotation;
        if (this.weapon.scale.y != 1) {
          rot += TWP2.MathUtil.ToRad(180);
        }
        var vx = Math.min(Math.abs(Math.cos(rot)) * dif, maxBlur);
        var vy = Math.min(Math.abs(Math.sin(rot)) * dif, maxBlur);
        this.blurX.blur = vx;
        this.blurY.blur = vy;
        var bBlurX = this.blurX.blur > minBlur;
        var bBlurY = this.blurY.blur > minBlur;
        if (bBlurX && bBlurY) {
          this.weapon.filters = [this.blurX, this.blurY];
        } else if (bBlurX) {
          this.weapon.filters = [this.blurX];
        } else if (bBlurY) {
          this.weapon.filters = [this.blurY];
        } else {
          this.weapon.filters = undefined;
        }
      }
    };
    Character.prototype.lookAt = function (_x, _y) {
      if (_x > this.x) {
        this.weapon.scale.y = 1;
      } else {
        this.weapon.scale.y = -1;
      }
      var useModifier = 1;
      if (this.getCurrentInventoryItem()) {
        useModifier = this.getCurrentInventoryItem()["moveModifier"];
      }
      this.desiredX = 100 / useModifier + _x * this.moveModifier;
      this.desiredY = this.game.world.height * 0.25 + _y * 0.5;
      return _super.prototype.lookAt.call(this, _x, _y);
    };
    Character.prototype.onMatchEnded = function () {
      this.stopWeaponFire();
      this.cancelReload();
    };
    Character.prototype.setCurrentClassIndex = function (_val) {
      this.currentClassIndex = _val;
    };
    Character.prototype.updateMoveModifier = function () {
      var currentWeapon = this.getCurrentInventoryItem();
      this.moveModifier = 0.15 * currentWeapon["moveModifier"];
    };
    Character.prototype.updateLookSpeed = function () {
      var currentWeapon = this.getCurrentInventoryItem();
      this.lookSpeed = 0.1 * currentWeapon["lookModifier"];
    };
    Character.prototype.resetModifiers = function () {
      var value = 1;
      this.modifiers[Character.MODIFIER_DAMAGE] = value;
      this.modifiers[Character.MODIFIER_VIEW_SPEED] = value;
      this.modifiers[Character.MODIFIER_FIRE_RATE] = value;
      this.modifiers[Character.MODIFIER_RELOAD_SPEED] = value;
      this.modifiers[Character.MODIFIER_ACCURACY] = value;
      this.modifiers[Character.MODIFIER_XP] = value;
      this.modifiers[Character.MODIFIER_RECOIL] = value;
      this.modifiers[Character.MODIFIER_RECOIL_RECOVERY] = value;
    };
    Character.prototype.getModifiers = function () {
      return this.modifiers;
    };
    Character.prototype.fireHandler = function () {
      if (!this.bWantsToFire) {
        this.bFireHandler = false;
      } else {
        var cur = this.getCurrentInventoryItem();
        if (this.canFire()) {
          if (cur) {
            this.fire();
            var fireMode = cur["fireMode"];
            if (fireMode == TWP2.WeaponDatabase.MODE_SEMI) {
              this.startFireDelay(cur["fireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE]);
              this.bFireHandler = false;
            } else if (fireMode == TWP2.WeaponDatabase.MODE_BURST) {
              this.startFireDelay(cur["burstFireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE]);
              cur["bursts"] = 2;
              this.burstTimer = cur["fireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE];
              this.bBurstFireHandler = true;
              this.bFireHandler = false;
            } else if (fireMode == TWP2.WeaponDatabase.MODE_AUTO) {
              this.startFireDelay(Math.max(2, cur["fireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE]));
            }
          }
        } else if (this.isReloading()) {
          if (this.getCurrentInventoryItem()) {
            if (cur["bSingleRoundLoaded"] && cur["mag"] > 0) {
              this.cancelReload();
            }
          }
        }
      }
    };
    Character.prototype.cancelReload = function () {
      this.bIsReloading = false;
      if (this.isPlayer()) {
        this.getPlayerController().getHUD().getCrosshair().setReloading(false);
      }
    };
    Character.prototype.startFireDelay = function (_delay) {
      this.bFireDelay = true;
      this.fireDelayTimer = _delay;
    };
    Character.prototype.startWeaponFire = function () {
      this.bWantsToFire = true;
      this.triggerFire();
    };
    Character.prototype.stopWeaponFire = function () {
      this.bWantsToFire = false;
    };
    Character.prototype.triggerFire = function () {
      var cur = this.getCurrentInventoryItem();
      if (cur) {
        if (cur["mag"] > 0) {
          this.bFireHandler = true;
        } else {
          if (this.isReloading()) {
            if (cur["bSingleRoundLoaded"]) {
              if (cur["mag"] > 0) {
                this.cancelReload();
              }
            }
          } else {
            if (this.canReload()) {
              this.reload();
            } else {
              if (cur["ammo"] <= 0) {
                /*
                              SoundManager.PlayWorldSound("wpn_empty", this.x, this.y);
                              if (this.otherWeaponHasAmmo())
                              {
                                  this.switchWeapon();
                              }
                              */
              }
            }
          }
        }
      }
    };
    Character.prototype.triggerBarrel = function () {
      var item = this.getCurrentInventoryItem();
      if (item["barrel"] == TWP2.WeaponDatabase.BARREL_BAYONET) {
        if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
          var rot = this.weapon.rotation + TWP2.MathUtil.Random(-15, 15) * TWP2.MathUtil.TO_RADIANS;
          var recoil = 80;
          this.weapon.x += Math.cos(rot) * recoil;
          this.weapon.y += Math.sin(rot) * recoil;
          this.recoilTween = this.game.add.tween(this.weapon).to({ x: 0, y: 0 }, 3000, Phaser.Easing.Elastic.Out, true);
        }
      } else if (item["barrel"] == TWP2.WeaponDatabase.BARREL_MASTERKEY) {
        if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
          if (item["grenades"] > 0) {
            var weapon = TWP2.WeaponDatabase.GetWeapon(TWP2.WeaponDatabase.WEAPON_SHORTY);
            var data = {};
            data["weapon"] = weapon;
            var pos = this.getWorldMuzzlePosition();
            var useAccuracy = weapon["accuracy"] * this.modifiers[Character.MODIFIER_ACCURACY] * 0.5;
            if (this.isPlayer()) {
              data["speed"] = TWP2.MathUtil.Dist(this.x, this.y, this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y + this.game.camera.y);
            }
            data["damage"] = weapon["damage"];
            data["damageMultiplier"] = this.modifiers[Character.MODIFIER_DAMAGE];
            data["headshotMultiplier"] = 1;
            for (var i = 0; i < 6; i++) {
              var rot = this.weapon.rotation + TWP2.MathUtil.Random(-useAccuracy, useAccuracy) * TWP2.MathUtil.TO_RADIANS;
              TWP2.GameUtil.GetGameState().createProjectile(pos.x, pos.y, rot, ProjectileBase.TYPE_BULLET, this, this.controller, data);
              if (this.isPlayer()) {
                TWP2.GameUtil.GetGameState().getGameMode().addShotsFired();
              }
            }
            TWP2.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weapon.rotation);
            TWP2.SoundManager.PlayWorldSound("wpn_fire_" + weapon["id"], this.x, this.y);
            item["grenades"]--;
            this.updateHUDGrenadeAmmo();
            this.addRecoil();
          } else {
            TWP2.SoundManager.PlayWorldSound("wpn_empty", this.x, this.y);
          }
        }
      } else if (item["barrel"] == TWP2.WeaponDatabase.BARREL_M203) {
        if (TWP2.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
          if (item["grenades"] > 0) {
            var weapon = TWP2.WeaponDatabase.GetWeapon(TWP2.WeaponDatabase.WEAPON_M203);
            var data = {};
            data["weapon"] = weapon;
            var pos = this.getWorldMuzzlePosition();
            var useAccuracy = weapon["accuracy"] * this.modifiers[Character.MODIFIER_ACCURACY];
            var rot = this.weapon.rotation + TWP2.MathUtil.Random(-useAccuracy, useAccuracy) * TWP2.MathUtil.TO_RADIANS;
            if (this.isPlayer()) {
              data["speed"] = TWP2.MathUtil.Dist(this.x, this.y, this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y + this.game.camera.y);
            }
            data["damage"] = weapon["damage"];
            TWP2.GameUtil.GetGameState().createProjectile(pos.x, pos.y, rot, ProjectileBase.TYPE_GRENADE, this, this.controller, data);
            TWP2.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weapon.rotation);
            TWP2.SoundManager.PlayWorldSound("wpn_fire_" + weapon["id"], this.x, this.y);
            if (this.isPlayer()) {
              TWP2.GameUtil.GetGameState().getGameMode().addShotsFired();
            }
            item["grenades"]--;
            this.updateHUDGrenadeAmmo();
            this.addRecoil();
          } else {
            TWP2.SoundManager.PlayWorldSound("wpn_empty", this.x, this.y);
          }
        }
      } else if (item["barrel"] == TWP2.WeaponDatabase.BARREL_LASER) {
        this.desiredLaserAlpha = this.desiredLaserAlpha > 0 ? 0 : Character.LASER_ALPHA_DEFAULT;
        TWP2.SoundManager.PlayWorldSound("wpn_laser", this.x, this.y, 0, this.desiredLaserAlpha > 0 ? 0.5 : 0.25);
      }
    };
    Character.prototype.playSound = function (_sfxId, _delay) {
      if (_delay === void 0) {
        _delay = 0;
      }
      var timer = this.game.time.create();
      timer.add(_delay, TWP2.SoundManager.PlayWorldSound, TWP2.SoundManager, _sfxId, this.x, this.y, 0, 0.5);
      timer.start();
    };
    Character.prototype.triggerWeapon = function (_bVal) {
      this.bWantsToFire = _bVal;
      if (_bVal) {
        this.startWeaponFire();
      } else {
        this.stopWeaponFire();
      }
    };
    Character.prototype.fire = function () {
      var weapon = this.getCurrentInventoryItem();
      var data = {};
      data["weapon"] = weapon;
      var pos = this.getWorldMuzzlePosition();
      var numBullets = weapon["type"] == TWP2.WeaponDatabase.TYPE_SHOTGUN ? 6 : 1;
      if (weapon["baseMod"] == TWP2.WeaponDatabase.BASE_BUCKSHOT) {
        numBullets = 10;
      }
      for (var i = 0; i < numBullets; i++) {
        var useAccuracy = weapon["accuracy"] * this.modifiers[Character.MODIFIER_ACCURACY];
        var rot = this.weapon.rotation + TWP2.MathUtil.Random(-useAccuracy, useAccuracy) * TWP2.MathUtil.TO_RADIANS;
        var projType = weapon["projectileType"];
        if (projType) {
          if (projType == ProjectileBase.TYPE_BULLET) {
            var magModifier = 1;
            var headshotMultiplier = 1;
            if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_FMJ) {
              data["bBig"] = true;
              magModifier = 1.25;
            } else if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_PIERCING) {
              data["bBig"] = true;
            } else if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_HOLLOWPOINT) {
              data["bBig"] = true;
              headshotMultiplier = 2;
            } else if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_EXPLOSIVE) {
              data["bBig"] = true;
              data["bExplosive"] = true;
            }
            if (weapon["muzzleMod"] == TWP2.WeaponDatabase.MUZZLE_BOOSTER) {
              magModifier *= 1.25;
            }
            data["damageMultiplier"] = this.modifiers[Character.MODIFIER_DAMAGE] * magModifier;
            data["headshotMultiplier"] = headshotMultiplier;
            data["counter"] = Math.round(weapon["penetration"] * 0.8);
          } else if (projType == ProjectileBase.TYPE_GRENADE) {
            data["bSticky"] = weapon["bSticky"];
            data["bImpact"] = weapon["bImpact"];
            if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_LAUNCHER_DAMAGE) {
              data["damageMultiplier"] = 1.5;
            } else if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_LAUNCHER_RADIUS) {
              data["radiusMultiplier"] = 1.5;
            }
          } else if (projType == ProjectileBase.TYPE_ROCKET) {
            if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_LAUNCHER_DAMAGE) {
              data["damageMultiplier"] = 1.5;
            } else if (weapon["magMod"] == TWP2.WeaponDatabase.MAG_LAUNCHER_RADIUS) {
              data["radiusMultiplier"] = 1.5;
            }
          }
          if (this.isPlayer()) {
            data["speed"] = TWP2.MathUtil.Dist(this.x, this.y, this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y + this.game.camera.y);
          }
        }
        data["damage"] = weapon["damage"];
        TWP2.GameUtil.GetGameState().createProjectile(pos.x, pos.y, rot, projType, this, this.controller, data);
        if (this.isPlayer()) {
          TWP2.GameUtil.GetGameState().getGameMode().addShotsFired();
        }
      }
      var bSuppressor = weapon["muzzleMod"] == TWP2.WeaponDatabase.MUZZLE_SUPPRESSOR;
      var mfType = bSuppressor ? "suppressor" : "default";
      var bForceFlash = weapon["bBoltAction"] || weapon["bPump"];
      TWP2.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weapon.rotation, mfType, 1, bForceFlash);
      if (weapon["bEjectShell"] != false && weapon["bBoltAction"] != true) {
        this.createShell();
      }
      if (weapon["id"] == TWP2.WeaponDatabase.WEAPON_RPG) {
        this.setMagVisible(false);
      }
      if (weapon["bBoltAction"] == true) {
        var boltDelay = 400;
        this.playSound("wpn_bolt", boltDelay);
        var timer = this.game.time.create();
        timer.add(boltDelay, this.createShell, this);
        timer.start();
      }
      if (weapon["bPump"] == true) {
        this.startPumpTween();
        this.playSound("wpn_pump", 150);
      } else {
        this.startSlideTween();
      }
      weapon["mag"]--;
      this.addRecoil();
      var sfxId = "wpn_fire_" + (weapon["sfxId"] != undefined ? weapon["sfxId"] : weapon["id"]);
      if (bSuppressor) {
        sfxId = TWP2.WeaponDatabase.GetSuppressedSoundId(weapon);
      }
      TWP2.SoundManager.PlayWorldSound(sfxId, this.x, this.y);
      this.updateHUDAmmo();
    };
    Character.prototype.addRecoil = function (_multiplier) {
      if (_multiplier === void 0) {
        _multiplier = 1;
      }
      var multiplier = _multiplier * this.modifiers[Character.MODIFIER_RECOIL];
      var item = this.getCurrentInventoryItem();
      var damage = item["damage"] * (item["type"] == TWP2.WeaponDatabase.TYPE_SHOTGUN ? 5 : 1);
      var recoil = -Math.max(damage * 0.5, 15) * multiplier;
      var rotRecoil = TWP2.MathUtil.Random(-3, 6) * (this.modifiers[Character.MODIFIER_RECOIL] * 0.8);
      var recoilAngle = this.weapon.rotation + TWP2.MathUtil.Random(-15, 20) * TWP2.MathUtil.TO_RADIANS;
      if (item["type"] == TWP2.WeaponDatabase.TYPE_PISTOL) {
        rotRecoil = TWP2.MathUtil.Random(damage * 0.5, damage) * 0.5;
      } else if (item["type"] == TWP2.WeaponDatabase.TYPE_LAUNCHER) {
        rotRecoil = TWP2.MathUtil.Random(damage * 0.5, damage) * 0.2;
      } else if (item["type"] == TWP2.WeaponDatabase.TYPE_SHOTGUN) {
        if (item["bPump"] == true) {
          recoilAngle = this.weapon.rotation + TWP2.MathUtil.Random(10, 30) * TWP2.MathUtil.TO_RADIANS;
        }
        if (item["fireMode"] == TWP2.WeaponDatabase.MODE_AUTO) {
          rotRecoil = TWP2.MathUtil.Random(damage * 0.5, damage) * 0.2;
        } else {
          rotRecoil = TWP2.MathUtil.Random(damage * 0.8, damage) * 0.15;
        }
        if (!item["bLowRecoil"]) {
          recoil *= 1.5;
        }
      } else if (item["type"] == TWP2.WeaponDatabase.TYPE_SNIPER) {
        if (item["bBoltAction"] == true) {
          recoilAngle = this.weapon.rotation + TWP2.MathUtil.Random(5, 15) * TWP2.MathUtil.TO_RADIANS;
          rotRecoil = TWP2.MathUtil.Random(damage * 0.8, damage) * 0.2;
          recoil *= 2;
        } else {
          rotRecoil = TWP2.MathUtil.Random(damage * 0.5, damage) * 0.1;
          recoil *= 1.4;
        }
      } else if (item["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
        rotRecoil *= 1.4;
      }
      if (item["bRevolver"] == true) {
        recoil *= 1.5;
      }
      if (item["bLowRecoil"] == true) {
        rotRecoil *= 0.5;
        recoil *= 0.8;
      }
      if (item["muzzleMod"] == TWP2.WeaponDatabase.MUZZLE_SUPPRESSOR) {
        rotRecoil *= 0.6;
        recoil *= 0.8;
      } else if (item["muzzleMod"] == TWP2.WeaponDatabase.MUZZLE_COMPENSATOR) {
        rotRecoil *= 0.8;
      } else if (item["muzzleMod"] == TWP2.WeaponDatabase.MUZZLE_BOOSTER) {
        rotRecoil *= 1.35;
      }
      if (item["barrelMod"] == TWP2.WeaponDatabase.BARREL_GRIP) {
        rotRecoil *= 0.5;
      }
      if (item["baseMod"] == TWP2.WeaponDatabase.BASE_RECOIL) {
        recoil *= 0.8;
        rotRecoil *= 0.8;
      }
      var recoilCooldown = Math.min(10, damage * 0.06);
      recoilCooldown *= this.modifiers[Character.MODIFIER_RECOIL_RECOVERY];
      if (item["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
        recoilCooldown *= 2;
        recoil *= 1.35;
      } else if (item["type"] == TWP2.WeaponDatabase.TYPE_PISTOL) {
        recoilCooldown *= 0.5;
      } else if (item["type"] == TWP2.WeaponDatabase.TYPE_SMG) {
        recoilCooldown *= 0.8;
      }
      var recoilMax = 50 * this.modifiers[Character.MODIFIER_RECOIL_RECOVERY];
      this.recoilCooldownSpeed = Math.min(recoilMax, this.recoilCooldownSpeed + recoilCooldown);
      var rot = recoilAngle;
      var maxX = Math.min((item["type"] == TWP2.WeaponDatabase.TYPE_SNIPER ? 100 : 40) + item["damage"] * 1.1, 250);
      this.weapon.x = Math.max(-maxX, this.weapon.x + Math.cos(rot) * recoil);
      this.weapon.y += Math.sin(rot) * recoil;
      this.weapon.rotation += rotRecoil * TWP2.MathUtil.TO_RADIANS * (this.weapon.scale.y < 0 ? 1 : -1);
      if (this.recoilTween) {
        this.recoilTween.stop();
        this.recoilTween = null;
      }
      this.recoilTween = this.game.add.tween(this.weapon).to({ x: 0, y: 0 }, Math.min(800 + damage * 15, 3000), Phaser.Easing.Elastic.Out, true);
      if (this.isPlayer()) {
        this.getPlayerController()
          .getHUD()
          .getCrosshair()
          .addRecoil(damage * 0.5);
        TWP2.GameUtil.GetGameState().shakeCamera(recoil * 0.5, false);
      }
    };
    Character.prototype.createShell = function () {
      var item = this.getCurrentInventoryItem();
      var pos = this.getWorldShellPosition();
      var rot = this.weapon.rotation;
      if (this.weapon.scale.y != 1) {
        rot += TWP2.MathUtil.ToRad(180);
      }
      if (item["bShellCasing"] == true || item["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
        if (TWP2.MathUtil.Random(1, 3) == 1) {
          TWP2.GameUtil.GetGameState().createShell(pos.x, pos.y, rot, "casing");
        }
      }
      return TWP2.GameUtil.GetGameState().createShell(pos.x, pos.y, rot, item["round"]);
    };
    Character.prototype.burstFireHandler = function () {
      var item = this.getCurrentInventoryItem();
      if (item["bursts"] > 0) {
        if (this.burstTimer > 0) {
          this.burstTimer--;
        } else {
          if (item["mag"] > 0) {
            if (item["bursts"] > 0) {
              item["bursts"]--;
            }
            this.burstTimer = item["fireRate"];
            this.fire();
          } else {
            this.burstFireComplete();
          }
        }
      } else {
        this.burstFireComplete();
      }
    };
    Character.prototype.burstFireComplete = function () {
      this.bBurstFireHandler = false;
    };
    Character.prototype.fireDelayHandler = function () {
      this.fireDelayTimer--;
      if (this.fireDelayTimer <= 0) {
        this.endFireDelay();
      }
    };
    Character.prototype.endFireDelay = function () {
      this.bFireDelay = false;
      var item = this.getCurrentInventoryItem();
      if (item["mag"] == 0) {
        if (this.canReload()) {
          this.reload();
        }
      }
      if (!this.bWantsToFire) {
        TWP2.SoundManager.PlayWorldSound("wpn_foley", this.x, this.y, 3, 0.5);
      }
    };
    Character.prototype.reloadHandler = function () {
      this.reloadTimer--;
      if (this.isPlayer()) {
        this.getPlayerController()
          .getHUD()
          .getCrosshair()
          .setReloadingPercentage(1 - this.reloadTimer / this.reloadTimerMax);
      }
      if (this.reloadTimer == 0) {
        this.onReloadComplete();
      }
    };
    Character.prototype.reload = function (_bAuto) {
      if (_bAuto === void 0) {
        _bAuto = false;
      }
      if (!this.canReload()) {
        return;
      }
      var firearm = this.getCurrentInventoryItem();
      var weaponId = firearm["id"];
      this.bIsReloading = true;
      this.reloadTimerMax = Math.ceil(firearm["reloadTime"] * 60 * this.modifiers[Character.MODIFIER_RELOAD_SPEED]);
      this.reloadTimer = this.reloadTimerMax;
      var crosshair = null;
      if (this.isPlayer()) {
        crosshair = this.getPlayerController().getHUD().getCrosshair();
      }
      TWP2.SoundManager.PlayWorldSound("wpn_reload_start", this.x, this.y, 0, 0.8);
      if (!firearm["bSingleRoundLoaded"]) {
        if (firearm["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
          TWP2.SoundManager.PlayWorldSound("wpn_box_out", this.x, this.y, 0, 1);
        }
        if (crosshair) {
          crosshair.setReloading(true);
          crosshair.setCanFire(false);
        }
      } else {
        if (crosshair) {
          crosshair.setReloading(true);
          crosshair.setCanFire(firearm["mag"] > 0);
        }
      }
      var bHasMag = this.setMagVisible(false);
      if (bHasMag && firearm["bEjectMag"] != false) {
        TWP2.GameUtil.GetGameState().createMag(this.x, this.y, this.weapon.rotation, firearm["id"]);
      }
      this.lockSlideBack();
      if (firearm["bRevolver"] == true || firearm["id"] == TWP2.WeaponDatabase.WEAPON_DB) {
        var len = firearm["magSize"] - firearm["mag"];
        for (var i = 0; i < len; i++) {
          this.createShell();
        }
      }
    };
    Character.prototype.setMagVisible = function (_bVal) {
      if (this.weapon) {
        var group = this.weapon.getAt(0);
        var mag = group.getByName("mag");
        if (mag) {
          mag.visible = _bVal;
          var slide = group.getByName("slide");
          this.updateShadow();
          return true;
        }
      }
      return false;
    };
    Character.prototype.lockSlideBack = function () {
      if (this.weapon) {
        var group = this.weapon.getAt(0);
        var slide = group.getByName("slide");
        if (slide) {
          var item = this.getCurrentInventoryItem();
          slide.x = Math.round(item["points"]["slide"]["x"] - slide.width * 0.5) + group.getByName("base").width * 0.5;
          var tweenTime = 50 + item["damage"] * 0.25;
          var slideX = 18 + item["damage"] * 0.2;
          if (this.slideTween) {
            this.slideTween.stop();
          }
          slide.x = slide.x - slideX;
          //this.slideTween = this.game.add.tween(slide).to({ x: slide.x - slideX }, tweenTime, Phaser.Easing.Exponential.InOut, true, 0, 0);
          this.updateShadow();
        }
      }
    };
    Character.prototype.lockSlideDefault = function () {
      if (this.weapon) {
        var group = this.weapon.getAt(0);
        var slide = group.getByName("slide");
        if (slide) {
          var item = this.getCurrentInventoryItem();
          var desiredX = Math.round(item["points"]["slide"]["x"] - slide.width * 0.5) + group.getByName("base").width * 0.5;
          var tweenTime = 50 + item["damage"] * 0.25;
          if (this.slideTween) {
            this.slideTween.stop();
          }
          slide.x = desiredX;
          //this.slideTween = this.game.add.tween(slide).to({ x: desiredX }, tweenTime, Phaser.Easing.Exponential.InOut, true, 0, 0);
          this.updateShadow();
        }
      }
    };
    Character.prototype.startSlideTween = function () {
      if (this.weapon) {
        var group = this.weapon.getAt(0);
        var slide = group.getByName("slide");
        if (slide) {
          var item = this.getCurrentInventoryItem();
          slide.x = Math.round(item["points"]["slide"]["x"] - slide.width * 0.5) + group.getByName("base").width * 0.5;
          var tweenTime = 50 + item["damage"] * 0.25;
          var slideX = 18 + item["damage"] * 0.2;
          if (this.slideTween) {
            this.slideTween.stop();
          }
          this.slideTween = this.game.add.tween(slide).to({ x: slide.x - slideX }, tweenTime, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        }
      }
    };
    Character.prototype.startPumpTween = function () {
      if (this.weapon) {
        var group = this.weapon.getAt(0);
        var pump = group.getByName("pump");
        if (pump) {
          var tweenTime = 150;
          var tweenDelay = 150;
          var curWeapon = this.getCurrentInventoryItem();
          if (curWeapon["pumpPositionX"] == undefined) {
            curWeapon["pumpPositionX"] = pump.x;
          } else {
            pump.x = curWeapon["pumpPositionX"];
          }
          var tween = this.game.add.tween(pump).to({ x: pump.x - 30 }, tweenTime, Phaser.Easing.Exponential.InOut, true, tweenDelay, 0, true);
          var timer = this.game.time.create();
          timer.add(tweenDelay + tweenTime * 0.5, this.createShell, this);
          timer.start();
        }
      }
    };
    Character.prototype.onReloadComplete = function () {
      this.bIsReloading = false;
      var cur = this.getCurrentInventoryItem();
      if (cur["bSingleRoundLoaded"]) {
        if (!this.bUnlimitedAmmo) {
          cur["ammo"] -= 1;
        }
        cur["mag"] += 1;
      } else {
        if (cur["mag"] >= cur["magSize"]) {
          if (!this.bUnlimitedAmmo) {
            cur["ammo"] -= cur["magSize"] - cur["mag"];
          }
          cur["mag"] = cur["magSize"];
        } else if (cur["ammo"] + cur["mag"] > cur["magSize"]) {
          if (!this.bUnlimitedAmmo) {
            cur["ammo"] -= cur["magSize"] - cur["mag"];
          }
          cur["mag"] += cur["magSize"] - cur["mag"];
        } else {
          cur["mag"] += cur["ammo"];
          if (!this.bUnlimitedAmmo) {
            cur["ammo"] -= cur["ammo"];
          }
        }
      }
      this.setMagVisible(true);
      if (this.isPlayer()) {
        var hud = this.getPlayerController().getHUD();
        hud.getCrosshair().setReloading(false);
        hud.getCrosshair().onReloadComplete();
      }
      this.updateHUDAmmo();
      if (cur["bSingleRoundLoaded"]) {
        if (cur["type"] == TWP2.WeaponDatabase.TYPE_SHOTGUN) {
          TWP2.SoundManager.PlayWorldSound("wpn_reload_shell_shotgun", this.x, this.y, 0, 0.5);
        } else {
          TWP2.SoundManager.PlayWorldSound("wpn_reload_end", this.x, this.y);
        }
        if (this.canReload()) {
          this.reload(true);
        }
      } else {
        TWP2.SoundManager.PlayWorldSound("wpn_reload_end", this.x, this.y);
      }
      this.lockSlideDefault();
      if (cur["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
        TWP2.SoundManager.PlayWorldSound("wpn_box_in", this.x, this.y, 0, 1);
      }
    };
    Character.prototype.getWorldLaserPosition = function () {
      if (this.weapon) {
        var group = this.weapon.getAt(0);
        var laser = group.getByName(TWP2.WeaponDatabase.BARREL_LASER);
        if (laser) {
          var pos = laser.world.clone();
          pos.x /= this.game.world.scale.x;
          pos.y /= this.game.world.scale.y;
          var offset = 8;
          var rot = this.weapon.rotation + TWP2.MathUtil.ToRad(45);
          var startX = pos.x + Math.cos(rot) * offset;
          var startY = pos.y + Math.sin(rot) * offset;
          return new Phaser.Point(startX, startY);
        }
      }
      return new Phaser.Point(this.x, this.y);
    };
    Character.prototype.getWorldMuzzlePosition = function () {
      var pos;
      if (!pos) {
        var offset = this.weapon.width * 0.5;
        var startX = this.x + this.weapon.x + Math.cos(this.weapon.rotation) * offset;
        var startY = this.y + this.weapon.y + Math.sin(this.weapon.rotation) * offset;
        pos = new Phaser.Point(startX, startY);
      }
      return pos;
    };
    Character.prototype.getWorldShellPosition = function () {
      var pos;
      var item = this.getCurrentInventoryItem();
      if (item) {
      }
      if (!pos) {
        var offset = this.weapon.width * 0.1;
        var rot = this.weapon.rotation - TWP2.MathUtil.ToRad(135);
        if (this.weapon.scale.y != 1) {
          rot += TWP2.MathUtil.ToRad(180);
        }
        var startX = this.x + this.weapon.x + Math.cos(rot) * offset;
        var startY = this.y + this.weapon.y + Math.sin(rot) * offset;
        pos = new Phaser.Point(startX, startY);
      }
      return pos;
    };
    Character.prototype.startSprinting = function () {
      this.bWantsToSprint = true;
    };
    Character.prototype.stopSprinting = function () {
      this.bWantsToSprint = false;
    };
    Character.prototype.isSprinting = function () {
      return this.bWantsToSprint;
    };
    Character.prototype.selectWeapon = function (_index) {
      if (this.bFireDelay) {
        return;
      }
      if (this.inventory) {
        if (_index <= this.inventory.length - 1 && this.currentInventoryIndex != _index) {
          this.currentInventoryIndex = _index;
          this.loadCurrentInventoryItem();
          this.updateHUDInventory();
        }
      }
    };
    Character.prototype.switchWeapon = function () {
      if (this.bFireDelay) {
        return;
      }
      if (this.inventory) {
        if (this.inventory.length > 1) {
          this.currentInventoryIndex = this.currentInventoryIndex ? 0 : 1;
          this.loadCurrentInventoryItem();
          this.x = 100;
        }
      }
      this.updateHUDInventory();
    };
    Character.prototype.addInventoryItem = function (_item) {
      this.inventory.push(_item);
      if (this.inventory.length == 1) {
        this.currentInventoryIndex = 0;
        this.loadCurrentInventoryItem();
        if (this.isPlayer()) {
          TWP2.SoundManager.PlayUISound("ui_loadout_equip");
        }
      }
      this.updateHUDInventory();
    };
    Character.prototype.replaceInventoryItem = function (_item, _index) {
      if (this.inventory.length >= _index) {
        delete this.inventory[_index];
        this.inventory[_index] = _item;
        this.currentInventoryIndex = _index;
        this.loadCurrentInventoryItem();
        this.x = 100;
      }
      this.updateHUDInventory();
    };
    Character.prototype.hasAnyAmmo = function () {
      return false;
    };
    Character.prototype.getInventory = function () {
      return this.inventory;
    };
    Character.prototype.updateHUDInventory = function () {
      if (this.isPlayer()) {
        var hud = this.getPlayerController().getHUD();
        hud.getInventoryInfo().updateInventory(this.inventory);
        hud.getInventoryInfo().updateInventoryIndex(this.currentInventoryIndex);
      }
    };
    Character.prototype.updateHUD = function () {
      if (this.isPlayer()) {
        var item = this.getCurrentInventoryItem();
        if (item) {
          var hud = this.getPlayerController().getHUD();
          hud.getInventoryInfo().updateWeapon(item);
          hud.getCrosshair().setReloading(false);
        }
      }
    };
    Character.prototype.updateHUDSkills = function () {
      if (this.isPlayer()) {
        var item = this.getCurrentInventoryItem();
        if (item) {
          var hud = this.getPlayerController().getHUD();
          hud.getInventoryInfo().updateSkills(this.skills);
        }
      }
    };
    Character.prototype.updateHUDAmmo = function () {
      if (this.isPlayer()) {
        var item = this.getCurrentInventoryItem();
        if (item) {
          var hud = this.getPlayerController().getHUD();
          hud.getInventoryInfo().updateAmmo(item["mag"], item["magSize"]);
          var crosshair = hud.getCrosshair();
          crosshair.setCanFire(item["mag"] > 0);
          if (this.isReloading()) {
            crosshair.setNeedsReload(false);
          } else {
            crosshair.setNeedsReload(item["mag"] < item["magSize"] * 0.5);
          }
        }
      }
    };
    Character.prototype.updateHUDGrenadeAmmo = function () {
      if (this.isPlayer()) {
        var item = this.getCurrentInventoryItem();
        if (item) {
          if (item["grenades"] != undefined) {
            var hud = this.getPlayerController().getHUD();
            hud.getInventoryInfo().updateGrenadeAmmo(item["grenades"], item["grenadesMax"]);
          }
        }
      }
    };
    Character.prototype.canReload = function () {
      var item = this.getCurrentInventoryItem();
      return item && !this.bIsReloading && item["mag"] < item["magSize"] && item["ammo"] > 0;
    };
    Character.prototype.isReloading = function () {
      return this.bIsReloading;
    };
    Character.prototype.canFire = function () {
      var item = this.getCurrentInventoryItem();
      return item && !this.isSprinting() && !this.bIsReloading && !this.bFireDelay && item["mag"] > 0;
    };
    Character.prototype.refreshCurrentItem = function () {
      var weapon = this.getCurrentInventoryItem();
      var mag = weapon["mag"];
      var prevPosition = new Phaser.Point(this.x, this.y);
      var prevRotation = this.weapon.rotation;
      var modData = {
        base: weapon["baseMod"],
        optic: weapon["optic"],
        mag: weapon["magMod"],
        barrel: weapon["barrel"],
        muzzle: weapon["muzzleMod"],
      };
      weapon = TWP2.WeaponDatabase.GetWeapon(weapon["id"]);
      weapon["mag"] = mag;
      TWP2.WeaponDatabase.ApplyWeaponMods(weapon, modData);
      this.replaceInventoryItem(weapon, 0);
      this.x = prevPosition.x;
      this.y = prevPosition.y;
      this.weapon.rotation = prevRotation;
    };
    Character.prototype.loadCurrentInventoryItem = function () {
      var current = this.getCurrentInventoryItem();
      if (!current) {
        return;
      }
      this.weapon.removeAll(true);
      var item = TWP2.GameUtil.CreateWeapon(current);
      item.scale.set(0.5, 0.5);
      item.x = -item.width * 0.5;
      item.y = -item.height * 0.5;
      this.weapon.add(item);
      if (this.isReloading()) {
        this.cancelReload();
      }
      if (current["mag"] == 0 && current["ammo"] > 0) {
        this.reload();
      } else {
        this.getPlayerController().getHUD().getCrosshair().setCanFire(true);
      }
      this.bLaserEnabled = current["barrel"] == TWP2.WeaponDatabase.BARREL_LASER;
      this.modifiers[Character.MODIFIER_RECOIL] = current["barrel"] == TWP2.WeaponDatabase.BARREL_GRIP ? 0.6 : 1;
      this.weapon.rotation = -90 * TWP2.MathUtil.TO_RADIANS;
      this.updateHUD();
      TWP2.SoundManager.PlayWorldSound("wpn_deploy_firearm", this.x, this.y, 3);
      this.updateShadow();
      if (this.isPlayer()) {
        var viewModifier = 1;
        if (current["type"] == TWP2.WeaponDatabase.TYPE_SNIPER) {
          viewModifier = 0.9;
        } else if (current["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
          TWP2.SoundManager.PlayWorldSound("wpn_chain", this.x, this.y);
        }
        if (!TWP2.WeaponDatabase.IsDefaultMod(current["optic"])) {
          if (current["optic"] == TWP2.WeaponDatabase.OPTIC_SCOPE) {
            viewModifier *= 0.85;
          } else if (current["optic"] == TWP2.WeaponDatabase.OPTIC_ACOG_1) {
            viewModifier *= 0.9;
          } else {
            viewModifier *= 0.95;
          }
        }
        TWP2.GameUtil.GetGameState().setDesiredWorldScale(viewModifier);
        this.updateLookSpeed();
        this.updateMoveModifier();
        if (current["baseMod"] == TWP2.WeaponDatabase.BASE_GREED) {
          this.modifiers[Character.MODIFIER_XP] = 2;
        } else {
          this.modifiers[Character.MODIFIER_XP] = 1;
        }
      }
      var keyInfo = TWP2.GameUtil.GetGameState().getHUD().getKeyInfo();
      if (TWP2.WeaponDatabase.IsUsableBarrelMod(current["barrel"]) && !current["bBarrelHint"]) {
        current["bBarrelHint"] = true;
        keyInfo.setFromMod(current["barrel"]);
        keyInfo.show();
      } else {
        keyInfo.hide();
      }
    };
    Character.prototype.updateShadow = function () {
      if (this.bShadowEnabled) {
        if (this.shadow) {
          this.shadow.destroy();
        }
        this.shadow = this.game.add.image(0, 0, this.weapon.generateTexture());
        this.shadow.anchor.set(0.5, 0.5);
        this.shadow.scale.set(0.8, 0.8);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.05;
        TWP2.GameUtil.GetGameState().addToWorld(this.shadow, TWP2.State_Game.INDEX_WALLS);
      }
    };
    Character.prototype.getCurrentInventoryItem = function () {
      if (!this.inventory) {
        return null;
      }
      return this.inventory[this.currentInventoryIndex];
    };
    Character.MAX_INVENTORY_ITEMS = 2;
    Character.MODIFIER_DAMAGE = "damage";
    Character.MODIFIER_VIEW_SPEED = "view_speed";
    Character.MODIFIER_FIRE_RATE = "fire_rate";
    Character.MODIFIER_RELOAD_SPEED = "reload_speed";
    Character.MODIFIER_ACCURACY = "accuracy";
    Character.MODIFIER_XP = "xp";
    Character.MODIFIER_RECOIL = "recoil";
    Character.MODIFIER_RECOIL_RECOVERY = "recoil_recovery";
    Character.LASER_ALPHA_DEFAULT = 0.3;
    return Character;
  })(Pawn);
  TWP2.Character = Character;
  var ProjectileBase = /** @class */ (function (_super) {
    __extends(ProjectileBase, _super);
    function ProjectileBase(_x, _y, _rotation, _causer, _instigator, _data) {
      var _this = _super.call(this, null, _x, _y) || this;
      _this.speed = 1;
      _this.damage = 0;
      _this.kills = 0;
      _this.rotation = _rotation;
      _this.causer = _causer;
      _this.instigator = _instigator;
      _this.data = _data;
      _this.enableDestroyTimer();
      _this.hit = [];
      return _this;
    }
    ProjectileBase.prototype.destroy = function () {
      this.causer = null;
      this.instigator = null;
      this.data = null;
      this.hit = null;
      _super.prototype.destroy.call(this);
    };
    ProjectileBase.prototype.triggerDestroy = function () {
      if (this.instigator instanceof TWP2.PlayerController) {
        if (this.kills > 1) {
          TWP2.GameUtil.GetGameState().getPlayerController().onMultiKill(this.kills);
        }
      }
      _super.prototype.triggerDestroy.call(this);
    };
    ProjectileBase.prototype.getData = function () {
      return this.data;
    };
    ProjectileBase.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.x < 0 || this.x > this.game.world.width || this.y < 0 || this.y > this.game.world.height) {
        this.triggerDestroy();
      }
    };
    ProjectileBase.prototype.addKill = function () {
      this.kills++;
    };
    ProjectileBase.prototype.getKills = function () {
      return this.kills;
    };
    ProjectileBase.TYPE_BULLET = "TYPE_BULLET";
    ProjectileBase.TYPE_ROCKET = "TYPE_ROCKET";
    ProjectileBase.TYPE_GRENADE = "TYPE_GRENADE";
    return ProjectileBase;
  })(WorldObject);
  TWP2.ProjectileBase = ProjectileBase;
  var Grenade = /** @class */ (function (_super) {
    __extends(Grenade, _super);
    function Grenade(_x, _y, _rotation, _causer, _instigator, _data) {
      var _this = _super.call(this, _x, _y, _rotation, _causer, _instigator, _data) || this;
      _this.detonationTimer = 90;
      _this.radius = 300;
      _this.tickMod = 30;
      _this.damage = _this.data["damage"];
      if (_this.data["damageMultiplier"] != undefined) {
        _this.damage *= _this.data["damageMultiplier"];
      }
      if (_this.data["radiusMultiplier"] != undefined) {
        _this.radius *= _this.data["radiusMultiplier"];
      }
      _this.speed = _this.data["speed"] ? _this.data["speed"] * 5 : 1000;
      _this.speed = Math.min(2000, _this.speed);
      _this.grenade = _this.game.add.sprite(0, 0, "atlas_effects", "projectile_grenade");
      _this.grenade.anchor.set(0.5, 0.5);
      TWP2.GameUtil.GetGameState().addToWorld(_this);
      _this.createBody();
      var offset = 5 * TWP2.MathUtil.TO_RADIANS;
      _this.body.velocity.x = Math.cos(_this.rotation + offset) * _this.speed;
      _this.body.velocity.y = Math.sin(_this.rotation + offset) * _this.speed;
      _this.body.angularVelocity += TWP2.MathUtil.Random(-20, 20);
      _this.setDestroyTimer(_this.detonationTimer / 60 + 1);
      return _this;
    }
    Grenade.prototype.destroy = function () {
      this.grenade = null;
      this.joint = null;
      _super.prototype.destroy.call(this);
    };
    Grenade.prototype.tick = function () {
      _super.prototype.tick.call(this);
      if (this.detonationTimer > 0) {
        this.detonationTimer--;
        if (!this.data["bImpact"] && this.detonationTimer % this.tickMod == 0) {
          TWP2.SoundManager.PlayWorldSound("wpn_grenade_tick", this.x, this.y, 0, 0.5);
          this.tickMod = Math.max(5, this.tickMod - 5);
        }
      } else {
        TWP2.GameUtil.GetGameState().createExplosion(this.x, this.y, this.radius, this.instigator, this, this.data);
        this.triggerDestroy();
      }
    };
    Grenade.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      TWP2.SoundManager.PlayWorldSound("physics_grenade_bounce", this.x, this.y, 0, 0.2);
      if (_obj instanceof Target) {
        if (this.data["bSticky"] == true) {
          if (this.body && _obj.getBody()) {
            if (!this.joint) {
              this.body.setZeroRotation();
              this.joint = this.game.physics.box2d.distanceJoint(this.body.sprite, _obj.getBody().sprite);
              TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.5);
            }
          }
        }
      }
      if (this.data["bImpact"] == true) {
        TWP2.GameUtil.GetGameState().createExplosion(this.x, this.y, this.radius, this.instigator, this, this.data);
        this.triggerDestroy();
      }
    };
    Grenade.prototype.createBody = function () {
      //var grenadeBody: Phaser.Physics.Box2D.Body = new Phaser.Physics.Box2D.Body(this.game, null, this.x, this.y);
      this.game.physics.box2d.enable(this.grenade, false);
      var grenadeBody = this.grenade.body;
      grenadeBody.x = this.x;
      grenadeBody.y = this.y;
      TWP2.GameUtil.GetGameState().addToWorld(this.grenade, TWP2.State_Game.INDEX_PAWNS);
      //var fixture = grenadeBody.setRectangleFromSprite(this.grenade);
      grenadeBody.dynamic = true;
      grenadeBody.rotation = this.rotation;
      grenadeBody.bullet = true;
      grenadeBody.restitution = 0.1;
      grenadeBody.linearDamping = 1;
      grenadeBody.angularDamping = 1;
      grenadeBody.setCollisionCategory(TWP2.State_Game.CATEGORY_PROJECTILES);
      grenadeBody.setCollisionMask(TWP2.State_Game.MASK_PROJECTILES);
      grenadeBody.angularVelocity = TWP2.MathUtil.Random(-80, 80) * TWP2.MathUtil.TO_RADIANS;
      this.addBody(grenadeBody);
      this.body = grenadeBody;
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
    };
    return Grenade;
  })(ProjectileBase);
  TWP2.Grenade = Grenade;
  var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket(_x, _y, _rotation, _causer, _instigator, _data) {
      var _this = _super.call(this, _x, _y, _rotation, _causer, _instigator, _data) || this;
      _this.radius = 350;
      _this.damage = _this.data["damage"];
      if (_this.data["damageMultiplier"] != undefined) {
        _this.damage *= _this.data["damageMultiplier"];
      }
      if (_this.data["radiusMultiplier"] != undefined) {
        _this.radius *= _this.data["radiusMultiplier"];
      }
      _this.speed = 1800;
      _this.rocket = _this.game.add.image(0, 0, "atlas_effects", "projectile_rocket");
      _this.addChild(_this.rocket);
      _this.rocket.anchor.set(1, 0.5);
      TWP2.GameUtil.GetGameState().addToWorld(_this);
      _this.createBody();
      _this.body.velocity.x = Math.cos(_this.rotation) * _this.speed;
      _this.body.velocity.y = Math.sin(_this.rotation) * _this.speed;
      return _this;
    }
    Rocket.prototype.destroy = function () {
      this.rocket = null;
      _super.prototype.destroy.call(this);
    };
    Rocket.prototype.tick = function () {
      _super.prototype.tick.call(this);
      TWP2.GameUtil.GetGameState().createSmoke(this.x, this.y, this.rotation + TWP2.MathUtil.Random(45, 45) * TWP2.MathUtil.TO_RADIANS, Smoke.SMOKE_DEFAULT);
    };
    Rocket.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      TWP2.SoundManager.PlayWorldSound("physics_body_fall", this.x, this.y);
      this.triggerDestroy();
      TWP2.GameUtil.GetGameState().createExplosion(this.x, this.y, this.radius, this.instigator, this, { damage: this.damage });
    };
    Rocket.prototype.createBody = function () {
      var rocketBody = new Phaser.Physics.Box2D.Body(this.game, null, this.x, this.y);
      var fixture = rocketBody.setCircle(10);
      rocketBody.gravityScale = 0;
      rocketBody.dynamic = true;
      rocketBody.rotation = this.rotation;
      rocketBody.friction = 0;
      rocketBody.bullet = true;
      rocketBody.setCollisionCategory(TWP2.State_Game.CATEGORY_PROJECTILES);
      rocketBody.setCollisionMask(TWP2.State_Game.MASK_PROJECTILES);
      this.addBody(rocketBody);
      this.body = rocketBody;
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
    };
    return Rocket;
  })(ProjectileBase);
  TWP2.Rocket = Rocket;
  var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(_x, _y, _rotation, _causer, _instigator, _data) {
      var _this = _super.call(this, _x, _y, _rotation, _causer, _instigator, _data) || this;
      _this.counter = 1;
      _this.counterMax = 1;
      _this.counterMult = 1;
      if (_this.data["counter"] != undefined) {
        _this.counter = _this.data["counter"];
        _this.counterMax = _this.counter;
      }
      _this.damage = _this.data["damage"];
      if (_this.data["damageMultiplier"] != undefined) {
        _this.damage *= _this.data["damageMultiplier"];
      }
      _this.speed = TWP2.MathUtil.Random(5000, 6000);
      _this.bullet = _this.game.add.image(0, 0, "atlas_effects", "projectile_bullet");
      _this.addChild(_this.bullet);
      _this.bullet.anchor.set(1, 0.5);
      _this.bullet.scale.x = TWP2.MathUtil.Random(10, 15) * 0.1;
      if (_this.data["bBig"] == true) {
        _this.bullet.scale.y = TWP2.MathUtil.Random(10, 20) * 0.1;
        _this.bullet.alpha = TWP2.MathUtil.Random(5, 10) * 0.1;
      } else {
        _this.bullet.alpha = TWP2.MathUtil.Random(1, 10) * 0.1;
      }
      if (_this.data["bExplosive"]) {
        _this.bullet.tint = Phaser.Color.linearInterpolation([0xffffff, 0xff0000], 0.25);
      }
      TWP2.GameUtil.GetGameState().addToWorld(_this);
      _this.createBody();
      _this.body.velocity.x = Math.cos(_this.rotation) * _this.speed;
      _this.body.velocity.y = Math.sin(_this.rotation) * _this.speed;
      if (TWP2.MathUtil.Random(1, 4) == 1) {
        TWP2.SoundManager.PlayWorldSound("physics_bullet_flyby", _this.x, _this.y, 5, 0.5);
      }
      _this.game.add.tween(_this.bullet).from({ alpha: 0 }, 50, Phaser.Easing.Exponential.In, true);
      _this.setDestroyTimer(1);
      return _this;
    }
    Bullet.prototype.destroy = function () {
      this.bullet = null;
      _super.prototype.destroy.call(this);
    };
    Bullet.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      var explosiveDamage = this.data["damage"] * 2;
      var explosiveRadius = 120;
      if (!_obj) {
        TWP2.SoundManager.PlayWorldSound("physics_concrete_impact_bullet", this.x, this.y, 3, 0.5);
        TWP2.GameUtil.GetGameState().createMuzzleFlash(this.x, this.y, this.rotation + 180 * TWP2.MathUtil.TO_RADIANS, "impact");
        if (this.data["bExplosive"]) {
          TWP2.GameUtil.GetGameState().createExplosion(this.x, this.y, explosiveRadius, this.instigator, this, { bRound: true, damage: explosiveDamage * (bHeadshot ? 1.5 : 1) });
        }
        this.triggerDestroy();
      } else if (this.hit.indexOf(_obj) < 0) {
        this.hit.push(_obj);
        var bHeadshot = false;
        if (_data) {
          bHeadshot = _data["bHead"];
        }
        TWP2.GameUtil.GetGameState().createMuzzleFlash(this.x, this.y, this.rotation + 180 * TWP2.MathUtil.TO_RADIANS, "impact");
        if (_obj instanceof Actor) {
          var actor = _obj;
          var realDamage = this.damage;
          var counterValue = 1;
          if (this.counterMax > 1) {
            counterValue = this.counterMult;
          }
          realDamage = realDamage * counterValue;
          if (bHeadshot) {
            realDamage *= this.data["headshotMultiplier"];
          }
          var target = actor instanceof Target ? actor : null;
          if (target) {
            var targetMaterial = target.getMaterial();
            if (targetMaterial == Target.MATERIAL_METAL) {
              var penetration = this.data["weapon"]["penetration"];
              realDamage = realDamage * Math.max(1, penetration * 0.6);
              TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.2);
            }
            target.addBulletHole(bHeadshot);
          }
          var soldier = actor instanceof Soldier ? actor : null;
          if (soldier) {
            var soldierMaterial = soldier.getMaterial();
            if (soldierMaterial == Target.MATERIAL_METAL) {
              var penetration = this.data["weapon"]["penetration"];
              realDamage = realDamage * Math.max(1, penetration * 0.6);
              TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.2);
            }
            soldier.addBulletHole(bHeadshot);
          }
          var harrier = actor instanceof Harrier ? actor : null;
          if (harrier) {
            var penetration = this.data["weapon"]["penetration"];
            realDamage = realDamage * Math.max(1, penetration * 0.5);
            TWP2.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.2);
            harrier.addBulletHole();
          }
          actor.takeDamage(realDamage, this.instigator, this, TWP2.DamageType.DAMAGE_TYPE_BULLET, bHeadshot);
          if (actor.getBody()) {
            var rad = this.rotation;
            var forceMult = actor.getForceMultiplier();
            var force = Math.min(realDamage * 5 * forceMult, 1000);
            actor.getBody().applyForce(Math.cos(rad) * force, Math.sin(rad) * force);
          }
          if (this.counter == this.counterMax) {
            TWP2.GameUtil.GetGameState().getGameMode().addShotsHit();
          }
          TWP2.SoundManager.PlayWorldSound("physics_body_impact_bullet", this.x, this.y, 3, 0.5);
        } else {
          TWP2.SoundManager.PlayWorldSound("physics_concrete_impact_bullet", this.x, this.y, 3, 0.5);
        }
        if (this.data["bExplosive"]) {
          this.counter -= 2;
          TWP2.GameUtil.GetGameState().createExplosion(this.x, this.y, explosiveRadius, this.instigator, this, { bRound: true, damage: explosiveDamage * (bHeadshot ? 1.5 : 1) });
        }
        this.counter--;
        this.counterMult *= 0.5 + Math.min(0.4, this.data["weapon"]["penetration"] * 0.02);
        if (this.counter <= 0) {
          this.triggerDestroy();
        }
      }
    };
    Bullet.prototype.createBody = function () {
      var bulletBody = new Phaser.Physics.Box2D.Body(this.game, null, this.x, this.y, 0);
      var mult = 1 + Math.min(this.damage * 0.025, 3);
      //var fixture = bulletBody.setCircle(2 * mult);
      var fixture = bulletBody.setRectangle(150, 6, 0, 0);
      fixture.SetSensor(true);
      bulletBody.gravityScale = 0;
      bulletBody.dynamic = true;
      bulletBody.rotation = this.rotation;
      bulletBody.friction = 0;
      bulletBody.bullet = true;
      bulletBody.setCollisionCategory(TWP2.State_Game.CATEGORY_PROJECTILES);
      bulletBody.setCollisionMask(TWP2.State_Game.MASK_PROJECTILES);
      this.addBody(bulletBody);
      this.body = bulletBody;
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
    };
    return Bullet;
  })(ProjectileBase);
  TWP2.Bullet = Bullet;
  var Mag = /** @class */ (function (_super) {
    __extends(Mag, _super);
    function Mag(_x, _y, _rotation, _type) {
      var _this = _super.call(this, null, _x, _y, _rotation) || this;
      _this.mag = _this.game.add.sprite(0, 0, "atlas_" + _type, "mag0000");
      _this.mag.scale.set(0.5, 0.5);
      _this.mag.anchor.set(0.5, 0.5);
      _this.addChild(_this.mag);
      TWP2.GameUtil.GetGameState().addToWorld(_this, TWP2.State_Game.INDEX_MAGS);
      _this.createBody();
      _this.setDestroyTimer(4);
      _this.enableDestroyTimer();
      return _this;
    }
    Mag.prototype.destroy = function () {
      this.mag = null;
      _super.prototype.destroy.call(this);
    };
    Mag.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      TWP2.SoundManager.PlayWorldSound("physics_body_hit", this.x, this.y, 3, 0.2);
    };
    Mag.prototype.createBody = function () {
      var magBody = new Phaser.Physics.Box2D.Body(this.game, this.mag, this.x, this.y, 0);
      magBody.setRectangleFromSprite(this.mag);
      magBody.rotation = this.rotation;
      magBody.dynamic = true;
      magBody.restitution = 0.1;
      magBody.setCollisionCategory(TWP2.State_Game.CATEGORY_OBJECTS);
      magBody.setCollisionMask(TWP2.State_Game.MASK_PAWNS);
      magBody.angularVelocity = TWP2.MathUtil.Random(-2, 2);
      this.addBody(magBody);
      this.body = magBody;
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
    };
    return Mag;
  })(WorldObject);
  TWP2.Mag = Mag;
  var Debris = /** @class */ (function (_super) {
    __extends(Debris, _super);
    function Debris(_x, _y, _rotation, _type) {
      var _this = _super.call(this, null, _x, _y, _rotation) || this;
      _this.timer = 0;
      _this.bCircle = false;
      _this.bNoCollisions = false;
      _this.debris = _this.game.add.sprite(0, 0, "atlas_objects", _type);
      _this.debris.anchor.set(0.5, 0.5);
      _this.addChild(_this.debris);
      TWP2.GameUtil.GetGameState().addToWorld(_this, TWP2.State_Game.INDEX_WALLS);
      var bTweenAlpha = true;
      var destroyMin = 5;
      var destroyMax = 8;
      if (_type == Debris.DEBRIS_STAR) {
        var scale = TWP2.MathUtil.Random(8, 10) * 0.1;
        _this.debris.scale.set(scale);
        _this.bCircle = true;
      } else if (_type == Debris.DEBRIS_TARGET_DEFAULT || _type == Debris.DEBRIS_TARGET_METAL) {
        bTweenAlpha = false;
        _this.debris.scale.x = TWP2.MathUtil.Random(5, 10) * 0.1;
        _this.debris.scale.y = TWP2.MathUtil.Random(5, 10) * 0.1;
        destroyMin = 0.5;
        destroyMax = 1;
        _this.bNoCollisions = true;
      }
      _this.createBody();
      _this.setDestroyTimer(TWP2.MathUtil.Random(destroyMin, destroyMax));
      _this.timer = _this.destroyTimer;
      _this.enableDestroyTimer();
      if (bTweenAlpha) {
        var tween = _this.game.add.tween(_this.debris).to({ alpha: TWP2.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Exponential.In, true);
      }
      return _this;
    }
    Debris.prototype.destroy = function () {
      this.debris = null;
      _super.prototype.destroy.call(this);
    };
    Debris.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      TWP2.SoundManager.PlayWorldSound("physics_target_hit", this.x, this.y, 3, 0.1);
    };
    Debris.prototype.createBody = function () {
      var debrisBody = new Phaser.Physics.Box2D.Body(this.game, this.debris, this.x, this.y, 0);
      if (this.bCircle) {
        debrisBody.setCircle(this.debris.width * 0.5);
      } else {
        debrisBody.setRectangleFromSprite(this.debris);
      }
      debrisBody.rotation = this.rotation;
      debrisBody.dynamic = true;
      debrisBody.restitution = 0.5;
      debrisBody.linearDamping = 0.5;
      debrisBody.angularDamping = 0.5;
      if (this.bNoCollisions) {
        debrisBody.setCollisionCategory(TWP2.State_Game.CATEGORY_SHELLS);
        debrisBody.setCollisionMask(TWP2.State_Game.MASK_OBJECTS);
      } else {
        debrisBody.setCollisionCategory(0);
        debrisBody.setCollisionMask(0);
      }
      var rad = this.rotation + (TWP2.MathUtil.Random(5, 30) - 90) * TWP2.MathUtil.TO_RADIANS;
      var speed = TWP2.MathUtil.Random(5, 25);
      debrisBody.applyForce(Math.cos(rad) * speed, Math.sin(rad) * speed);
      debrisBody.angularVelocity = TWP2.MathUtil.Random(-15, 15);
      this.addBody(debrisBody);
      this.body = debrisBody;
      if (!this.bNoCollisions) {
        this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
        this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
      }
    };
    Debris.DEBRIS_TARGET_HEAD = "target_head";
    Debris.DEBRIS_TARGET_HEAD_GIB_1 = "target_head_gib_1";
    Debris.DEBRIS_TARGET_HEAD_GIB_2 = "target_head_gib_2";
    Debris.DEBRIS_TARGET_HEAD_GIB_3 = "target_head_gib_3";
    Debris.DEBRIS_TARGET_BODY = "target_body";
    Debris.DEBRIS_TARGET_BODY_GIB_1 = "target_body_gib_1";
    Debris.DEBRIS_TARGET_BODY_GIB_2 = "target_body_gib_2";
    Debris.DEBRIS_TARGET_BODY_GIB_3 = "target_body_gib_3";
    Debris.DEBRIS_STAR = "star";
    Debris.DEBRIS_TARGET_DEFAULT = "debris_target_default";
    Debris.DEBRIS_TARGET_METAL = "debris_target_metal";
    return Debris;
  })(WorldObject);
  TWP2.Debris = Debris;
  var Shell = /** @class */ (function (_super) {
    __extends(Shell, _super);
    function Shell(_x, _y, _rotation, _type) {
      var _this = _super.call(this, null, _x, _y, _rotation) || this;
      _this.shellType = _type;
      _this.shell = _this.game.add.sprite(0, 0, "atlas_objects", "shell_" + _type);
      _this.shell.anchor.set(0.5, 0.5);
      _this.addChild(_this.shell);
      TWP2.GameUtil.GetGameState().addToWorld(_this, TWP2.State_Game.INDEX_SHELLS);
      _this.createBody();
      _this.setDestroyTimer(_type == "casing" ? 1 : 3);
      _this.enableDestroyTimer();
      return _this;
    }
    Shell.prototype.destroy = function () {
      this.blurX = null;
      this.blurY = null;
      this.shell = null;
      _super.prototype.destroy.call(this);
    };
    Shell.prototype.clearBlur = function () {
      this.filters = undefined;
      this.blurX = null;
      this.blurY = null;
    };
    Shell.prototype.onHit = function (_obj, _data) {
      _super.prototype.onHit.call(this, _obj, _data);
      var sfx = this.shellType == TWP2.WeaponDatabase.ROUND_12G ? "shotgun" : "generic";
      TWP2.SoundManager.PlayWorldSound("physics_shell_" + sfx, this.x, this.y, 3, TWP2.MathUtil.Random(1, 4) * 0.1);
    };
    Shell.prototype.createBody = function () {
      var shellBody = new Phaser.Physics.Box2D.Body(this.game, this.shell, this.x, this.y, 0);
      shellBody.setRectangleFromSprite(this.shell);
      shellBody.rotation = this.rotation;
      shellBody.dynamic = true;
      shellBody.restitution = 0.2;
      shellBody.setCollisionCategory(TWP2.State_Game.CATEGORY_SHELLS);
      shellBody.setCollisionMask(TWP2.State_Game.MASK_OBJECTS);
      var rad = this.rotation + (TWP2.MathUtil.Random(-25, 5) - 90) * TWP2.MathUtil.TO_RADIANS;
      var speed = TWP2.MathUtil.Random(5, 15);
      if (this.shellType == "casing") {
        speed *= 0.8;
      }
      shellBody.applyForce(Math.cos(rad) * speed, Math.sin(rad) * speed);
      shellBody.angularVelocity = TWP2.MathUtil.Random(-15, 30);
      this.addBody(shellBody);
      this.body = shellBody;
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
      this.body.setCategoryContactCallback(TWP2.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
    };
    return Shell;
  })(WorldObject);
  TWP2.Shell = Shell;
  var Smoke = /** @class */ (function (_super) {
    __extends(Smoke, _super);
    function Smoke(_type) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.alphaRate = -0.01;
      _this.scaleXRate = 0;
      _this.scaleYRate = 0;
      _this.rotationRate = 0;
      _this.xRate = 0;
      _this.smokeType = _type;
      var atlas = "atlas_effects";
      var atlasKey = "smoke";
      var tintColour = 0xffffff;
      if (_this.smokeType == Smoke.SMOKE_DEFAULT) {
        _this.alpha = 0.3;
        _this.scale.set(TWP2.MathUtil.Random(25, 50) * 0.01, TWP2.MathUtil.Random(25, 50) * 0.01);
        _this.alphaRate = -0.004;
        _this.scaleXRate = TWP2.MathUtil.Random(1, 5) * 0.01;
        _this.scaleYRate = TWP2.MathUtil.Random(1, 5) * 0.01;
        _this.rotationRate = TWP2.MathUtil.Random(-4, 4) * 0.1 * TWP2.MathUtil.TO_RADIANS;
      } else if (_this.smokeType == Smoke.SMOKE_DEBRIS) {
        _this.alpha = 0.2;
        _this.scale.set(0.2, 0.2);
        _this.alphaRate = -0.004;
        _this.scaleXRate = _this.scaleYRate = TWP2.MathUtil.Random(1, 2) * 0.01;
        _this.rotationRate = TWP2.MathUtil.Random(-5, 5) * 0.1 * TWP2.MathUtil.TO_RADIANS;
      } else if (_this.smokeType == Smoke.SMOKE_MUZZLE) {
        _this.alpha = TWP2.MathUtil.Random(15, 25) * 0.01;
        _this.scale.set(0.35, 0.35);
        _this.alphaRate = -0.005;
        _this.scaleXRate = TWP2.MathUtil.Random(-1, 5) * 0.01;
        _this.scaleYRate = TWP2.MathUtil.Random(1, 5) * 0.01;
        _this.rotationRate = TWP2.MathUtil.Random(-12, 12) * 0.1 * TWP2.MathUtil.TO_RADIANS;
        _this.xRate = TWP2.MathUtil.Random(1, 4);
      } else if (_this.smokeType == Smoke.SMOKE_IMPACT) {
        _this.alpha = TWP2.MathUtil.Random(15, 25) * 0.01;
        _this.scale.set(0.25, 0.25);
        _this.alphaRate = -0.008;
        _this.scaleXRate = TWP2.MathUtil.Random(2, 8) * 0.01;
        _this.scaleYRate = TWP2.MathUtil.Random(2, 8) * 0.01;
        _this.rotationRate = TWP2.MathUtil.Random(-12, 12) * 0.1 * TWP2.MathUtil.TO_RADIANS;
        _this.xRate = TWP2.MathUtil.Random(1, 3);
      } else if (_this.smokeType == Smoke.SMOKE_TARGET) {
        _this.alpha = 0.8;
        _this.scale.set(0.8, 0.8);
        _this.alphaRate = -0.025;
        _this.scaleXRate = TWP2.MathUtil.Random(10, 20) * 0.001;
        _this.scaleYRate = TWP2.MathUtil.Random(10, 20) * 0.001;
        _this.rotationRate = TWP2.MathUtil.Random(-8, 8) * 0.1 * TWP2.MathUtil.TO_RADIANS;
        _this.xRate = TWP2.MathUtil.Random(10, 20) * 0.1;
        tintColour = Phaser.Color.linearInterpolation([TWP2.ColourUtil.COLOUR_RED, 0xffffff], 0.4);
      }
      _this.smoke = _this.game.add.image(0, 0, atlas, atlasKey);
      _this.smoke.anchor.set(0.5, 0.5);
      _this.smoke.tint = tintColour;
      //this.smoke.rotation = WilkinUtil.GenerateRandomNumber(-180, 180) * WilkinUtil.TO_RADIANS;
      _this.add(_this.smoke);
      TWP2.GameUtil.GetGameState().addToWorld(_this, TWP2.State_Game.INDEX_PAWNS);
      return _this;
    }
    Smoke.prototype.destroy = function () {
      this.smoke = null;
      _super.prototype.destroy.call(this);
    };
    Smoke.prototype.update = function () {
      _super.prototype.update.call(this);
      if (!TWP2.GameUtil.GetGameState().isPaused()) {
        this.tick();
      }
    };
    Smoke.prototype.tick = function () {
      if (this.alpha <= 0 || this.smoke.scale.x <= 0 || this.smoke.scale.y <= 0) {
        TWP2.GameUtil.GetGameState().destroySmoke(this);
      } else {
        this.alpha += this.alphaRate;
        this.smoke.scale.x += this.scaleXRate;
        this.smoke.scale.y += this.scaleYRate;
        this.smoke.rotation += this.rotationRate;
        this.smoke.x += this.xRate;
      }
    };
    Smoke.SMOKE_DEFAULT = "SMOKE_DEFAULT";
    Smoke.SMOKE_MUZZLE = "SMOKE_MUZZLE";
    Smoke.SMOKE_IMPACT = "SMOKE_IMPACT";
    Smoke.SMOKE_DEBRIS = "SMOKE_DEBRIS";
    Smoke.SMOKE_TARGET = "SMOKE_TARGET";
    return Smoke;
  })(Phaser.Group);
  TWP2.Smoke = Smoke;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var State_Boot = /** @class */ (function (_super) {
    __extends(State_Boot, _super);
    function State_Boot() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.fontIndex = 0;
      return _this;
    }
    State_Boot.prototype.init = function () {
      this.game.forceSingleUpdate = true;
      this.game.clearBeforeRender = true;
      this.game.stage.setBackgroundColor("#000000");
      this.game.stage.disableVisibilityChange = true;
      this.game.renderer.renderSession.roundPixels = true;
      this.game.antialias = false;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.pageAlignHorizontally = true;
      TWP2.GameUtil.game = this.game;
      TWP2.GameUtil.game.initialize();
    };
    State_Boot.prototype.create = function () {
      try {
        window.addEventListener(
          "keydown",
          function (e) {
            if ([32].indexOf(e.keyCode) > -1) {
              e.preventDefault();
            }
          },
          false
        );
      } catch (e) {
        console.error(e);
      }
      this.game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
      };
      this.game.physics.startSystem(Phaser.Physics.BOX2D);
      this.game.physics.box2d.gravity.y = 1600;
      this.game.physics.box2d.velocityIterations = 3;
      this.game.physics.box2d.positionIterations = 3;
      if (TWP2.GameUtil.IsDebugging()) {
        this.game.physics.box2d.debugDraw.joints = true;
      }
      this.verifyFonts();
    };
    State_Boot.prototype.verifyFonts = function () {
      this.fontIndex = 0;
      this.fonts = [TWP2.FontUtil.FONT, TWP2.FontUtil.FONT_HUD];
      this.fontsText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.5, "Loading fonts...");
      this.fontsText.alpha = 0.2;
      this.fontsText.anchor.set(0.5, 0.5);
      this.loadNextFont();
    };
    State_Boot.prototype.loadNextFont = function () {
      if (this.fontIndex > this.fonts.length - 1) {
        var timer = this.game.time.create();
        timer.add(TWP2.GameUtil.IsDebugging() ? 50 : 500, this.startPreloader, this);
        timer.start();
      } else {
        this.fontsText.setStyle({ font: "12px " + this.fonts[this.fontIndex], fill: "#FFFFFF" }, true);
        this.fontsText.setText("Loading font: " + this.fonts[this.fontIndex], true);
        this.fontIndex++;
        var timer = this.game.time.create();
        timer.add(TWP2.GameUtil.IsDebugging() ? 50 : 500, this.loadNextFont, this);
        timer.start();
      }
    };
    State_Boot.prototype.startPreloader = function () {
      this.game.state.start(TWP2.Engine.STATE_PRELOADER);
    };
    return State_Boot;
  })(Phaser.State);
  TWP2.State_Boot = State_Boot;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var State_Game = /** @class */ (function (_super) {
    __extends(State_Game, _super);
    function State_Game() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.max = 0;
      _this.maxPawns = 1;
      _this.targetX = 0;
      _this.targetY = 0;
      _this.targetScale = 1;
      _this.targetScaleModifier = 1;
      _this.cameraMouseLookRatio = 0.5;
      _this.cameraMouseLookRatio2 = _this.cameraMouseLookRatio * 0.5;
      _this.cameraMouseLookRatioMultiplier = 1;
      _this.bPaused = false;
      _this.bPendingDestroy = false;
      return _this;
    }
    State_Game.prototype.init = function (_data) {
      _super.prototype.init.call(this, _data);
      this.data = _data;
      this.worldFilters = {
        blur: { bEnabled: false },
        gray: { bEnabled: false },
      };
      this.controllers = [];
      this.objects = [];
      this.shells = [];
      this.debris = [];
      this.objectsToDestroy = [];
      this.queue = [];
      this.muzzleFlashes = [];
      this.explosions = [];
      this.smokes = [];
      this.pawns = [];
      this.decals = [];
      this.emitters = [];
      this.layerWorld = this.game.add.group();
      this.layerWorld_0 = this.game.add.group();
      this.layerWorld.add(this.layerWorld_0);
      this.layerWorld_1 = this.game.add.group();
      this.layerWorld.add(this.layerWorld_1);
      this.layerWorld_2 = this.game.add.group();
      this.layerWorld.add(this.layerWorld_2);
      this.layerWorld_3 = this.game.add.group();
      this.layerWorld.add(this.layerWorld_3);
      this.layerWorld_4 = this.game.add.group();
      this.layerWorld.add(this.layerWorld_4);
      this.layerWorld_5 = this.game.add.group();
      this.layerWorld.add(this.layerWorld_5);
      this.layerUI = this.game.add.group();
      this.layerPauseMenu = this.game.add.group();
      TWP2.GameUtil.game.ui.add(this.layerUI);
      TWP2.GameUtil.game.ui.add(this.layerPauseMenu);
      TWP2.AdUtil.OnResumeGame();
    };
    State_Game.prototype.create = function () {
      this.game.physics.box2d.paused = false;
      this.buildWorld();
      this.setMaxPawns(22);
      var gameModeId = this.data["gameMode"];
      if (gameModeId == TWP2.GameModeDatabase.GAME_RANGE) {
        this.gameMode = new TWP2.GameMode_Range();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_SHOOTER) {
        this.gameMode = new TWP2.GameMode_MultiShooter();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_SNIPER) {
        this.gameMode = new TWP2.GameMode_Sniper();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_TIME_ATTACK) {
        this.gameMode = new TWP2.GameMode_TimeAttack();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_DEFENDER) {
        this.gameMode = new TWP2.GameMode_Defender();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_LAVA) {
        this.gameMode = new TWP2.GameMode_Lava();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_HARDENED) {
        this.gameMode = new TWP2.GameMode_Hardened();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_REFLEX) {
        this.gameMode = new TWP2.GameMode_Reflex();
      } else if (gameModeId == TWP2.GameModeDatabase.GAME_WAR) {
        this.gameMode = new TWP2.GameMode_War();
      } else {
        this.gameMode = new TWP2.RankedGameMode();
      }
      if (this.gameMode) {
        this.gameMode.setId(gameModeId);
        this.createPlayerController();
        this.gameMode.setFromData(this.data);
        this.gameMode.setMatchIsWaitingToStart();
        this.getHUD().getModeInfo().setGameMode(gameModeId);
        if (this.gameMode instanceof TWP2.GameMode_Range) {
          var timer = this.game.time.create();
          timer.add(3000, this.getHUD().getModeInfo().hide, this.getHUD().getModeInfo());
          timer.start();
        }
      }
      this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.onPauseKeyPressed, this);
      this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.onPauseKeyPressed, this);
      this.bPendingDestroy = false;
      this.bPaused = false;
      TWP2.SoundManager.PlayMusic("music_game_lobby");
      TWP2.SoundManager.PlayAmbience("amb_room");
    };
    State_Game.prototype.update = function () {
      if (this.bPaused || this.bPendingDestroy) {
        return;
      }
      while (this.muzzleFlashes.length > 0) {
        this.muzzleFlashes[0].destroy();
        this.muzzleFlashes.splice(0, 1);
      }
      var deadPawns = 0;
      var lastDeadPawn = null;
      for (var i = 0; i < this.controllers.length; i++) {
        this.controllers[i].tick();
        var pawn = this.controllers[i].getPawn();
        if (pawn) {
          if (!pawn.isAlive()) {
            deadPawns++;
            lastDeadPawn = pawn;
          }
        }
      }
      if (deadPawns > State_Game.MAX_DEAD_PAWNS) {
        lastDeadPawn.triggerDestroy();
      }
      for (i = 0; i < this.objects.length; i++) {
        this.objects[i].tick();
      }
      for (i = this.explosions.length - 1; i > 0; i--) {
        if (this.explosions[i].alpha <= 0) {
          this.explosions[i].destroy();
          this.explosions.splice(i, 1);
        }
      }
      if (this.gameMode) {
        this.gameMode.tick();
      }
      this.updateCamera();
      for (i = this.queue.length - 1; i >= 0; i--) {
        if (this.queue[i] instanceof box2d.b2Joint) {
          this.game.physics.box2d.world.DestroyJoint(this.queue[i]);
        } else if (this.queue[i] instanceof Phaser.Physics.Box2D.Body) {
          var bod = this.queue[i];
          this.removeBody(bod);
        } else if (this.queue[i][0] instanceof TWP2.WorldObject) {
          this.onCollide(this.queue[i][0], this.queue[i][1]);
        } else {
          this.onCollideData(this.queue[i][0], this.queue[i][1]);
        }
        this.queue.splice(i, 1);
      }
      for (i = 0; i < this.objectsToDestroy.length; i++) {
        var cur = this.objectsToDestroy[i];
        if (cur instanceof TWP2.Pawn) {
          this.pawns.splice(this.pawns.indexOf(cur), 1);
        } else if (cur instanceof TWP2.Shell) {
          this.shells.splice(this.shells.indexOf(cur), 1);
        } else if (cur instanceof TWP2.Debris) {
          this.debris.splice(this.debris.indexOf(cur), 1);
        }
        var indexObjects = this.objects.indexOf(cur);
        if (indexObjects >= 0) {
          this.objects.splice(indexObjects, 1);
        } else {
          console.error(cur);
        }
        cur.destroy();
      }
      this.objectsToDestroy = [];
      _super.prototype.update.call(this, this.game);
    };
    /*
      render()
      {
          //this.game.debug.box2dWorld();
          this.game.time.physicsElapsed = 1 / this.game.time.fps;
      }
      */
    State_Game.FilterRaycastHit = function (body, fixture, point, normal) {
      var filterData = fixture.GetFilterData();
      if (filterData.categoryBits == State_Game.CATEGORY_OBJECTS) {
        return true;
      }
      if (filterData.categoryBits == State_Game.CATEGORY_WALLS) {
        return true;
      }
      if (filterData.categoryBits == State_Game.CATEGORY_SOLDIERS) {
        return true;
      }
      return false;
    };
    State_Game.prototype.getData = function () {
      return this.data;
    };
    State_Game.prototype.getMaxPawns = function () {
      return this.maxPawns;
    };
    State_Game.prototype.setMaxPawns = function (_val) {
      this.maxPawns = Math.max(_val, 1);
    };
    State_Game.prototype.getPawns = function () {
      return this.pawns;
    };
    State_Game.prototype.getNumLivingTargets = function () {
      var count = 0;
      for (var i = 0; i < this.pawns.length; i++) {
        if (!this.pawns[i].isPlayer() && this.pawns[i].isAlive()) {
          count++;
        }
      }
      return count;
    };
    State_Game.prototype.isPaused = function () {
      return this.bPaused;
    };
    State_Game.prototype.onPauseKeyPressed = function () {
      if (this.player && !this.gameMode.matchHasEnded()) {
        if (!this.bPaused) {
          this.setPaused(!this.bPaused);
        }
      }
    };
    State_Game.prototype.getPauseMenu = function () {
      return this.pauseMenu;
    };
    State_Game.prototype.setPaused = function (_bVal, _bUsePauseMenu) {
      if (_bUsePauseMenu === void 0) {
        _bUsePauseMenu = true;
      }
      if (_bVal) {
        this.bPaused = true;
        for (var i = 0; i < this.emitters.length; i++) {
          this.emitters[i].visible = false;
        }
        if (this.pauseMenu) {
          this.pauseMenu.destroy();
        }
        if (_bUsePauseMenu) {
          this.pauseMenu = new TWP2.PauseMenu();
          this.layerUI.visible = false;
        }
        this.gameMode.onGamePaused();
        this.getHUD().onGamePaused();
      } else {
        this.bPaused = false;
        for (var i = 0; i < this.emitters.length; i++) {
          this.emitters[i].visible = true;
        }
        if (this.pauseMenu) {
          this.pauseMenu.close();
        }
        this.layerUI.visible = true;
        var bShowMouse = false;
        this.gameMode.onGameResumed();
        this.getHUD().onGameResumed();
      }
      this.game.physics.box2d.paused = this.bPaused;
      TWP2.SoundManager.UpdateAmbienceVolume();
    };
    State_Game.prototype.buildWorld = function () {
      this.world.setBounds(0, 0, this.game.width * 1.65, this.game.height * 1.25);
      var background = this.game.add.group();
      var img = this.game.add.image(0, 0, "tiles");
      var numWidth = Math.ceil(this.game.world.width / img.width);
      var numHeight = Math.ceil(this.game.world.height / img.height);
      img.destroy();
      var curX = 0;
      var curY = 0;
      for (var i = 0; i < numHeight; i++) {
        for (var j = 0; j < numWidth; j++) {
          var newImg = this.game.add.image(0, 0, "tiles");
          newImg.x = img.width * curX;
          newImg.y = img.height * curY;
          background.add(newImg);
          curX++;
        }
        curY++;
        curX = 0;
      }
      this.addToWorld(background, State_Game.INDEX_WALLS);
      var gfx = this.game.add.graphics();
      gfx.lineStyle(1, 0x000000, 0.5);
      gfx.beginFill(0x33312e, 1);
      var groundOffset = 400;
      gfx.drawRect(0, 0, this.world.width, 50 + groundOffset);
      var ground = this.game.add.sprite(0, 0, gfx.generateTexture());
      this.game.physics.box2d.enable(ground);
      ground.body.static = true;
      ground.body.x = this.world.width * 0.5;
      ground.body.y = this.world.height - ground.height * 0.5 + groundOffset;
      this.addToWorld(ground, State_Game.INDEX_MAGS);
      var groundBody = ground.body;
      groundBody.setCollisionCategory(State_Game.CATEGORY_WALLS);
      this.groundBody = groundBody;
      gfx.destroy();
      var edges = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
      edges.addEdge(0, 0, this.world.width, 0);
      edges.addEdge(0, 0, 0, this.world.height);
      edges.addEdge(this.world.width, 0, this.world.width, this.world.height);
      edges.setCollisionCategory(State_Game.CATEGORY_WALLS);
      this.game.physics.box2d.setBoundsToWorld();
      this.game.physics.box2d.debugDraw.shapes = true;
      this.game.physics.box2d.debugDraw.joints = true;
      /*
          var emitter = this.game.add.emitter(this.game.width * 0.5, this.game.height * 0.5, 5);
          emitter.makeParticles("atlas_objects", "particle_dust");
          emitter.maxParticleScale = 1.0;
          emitter.minParticleScale = 0.5;
          emitter.setAlpha(0.5, 1);
          emitter.setYSpeed(0, 60);
          emitter.gravity.set(0, 12);
          emitter.width = this.game.world.width;
          emitter.height = this.game.world.height;
          emitter.start(false, 7500, 12);
          this.addEmitter(emitter);
          */
      for (var i = 0; i < 10; i++) {
        var decal = this.createDecal(TWP2.MathUtil.Random(0, this.game.width), TWP2.MathUtil.Random(0, this.game.height), "decal_crater");
      }
      for (var i = 0; i < 3; i++) {
        var decal = this.createDecal(TWP2.MathUtil.Random(0, this.game.width), TWP2.MathUtil.Random(0, this.game.height), "decal_wall");
        decal.alpha *= 0.8;
      }
      this.targetScale = 1;
      this.targetScaleModifier = 1;
      this.game.world.scale.set(0.75, 0.75);
    };
    State_Game.prototype.addEmitter = function (_emitter) {
      this.addToWorld(_emitter, State_Game.INDEX_WALLS);
      this.emitters.push(_emitter);
    };
    State_Game.prototype.addToWorld = function (_item, _index) {
      if (_index === void 0) {
        _index = 0;
      }
      if (_index == State_Game.INDEX_WALLS) {
        this.layerWorld_0.add(_item);
      } else if (_index == State_Game.INDEX_MAGS) {
        this.layerWorld_1.add(_item);
      } else if (_index == State_Game.INDEX_PAWNS) {
        this.layerWorld_2.add(_item);
      } else if (_index == State_Game.INDEX_SHELLS) {
        this.layerWorld_3.add(_item);
      } else if (_index == State_Game.INDEX_LASER) {
        this.layerWorld_4.add(_item);
      } else if (_index == State_Game.INDEX_LAVA) {
        this.layerWorld_5.add(_item);
      } else {
        console.log("Invalid world index");
        this.layerWorld.add(_item);
      }
    };
    State_Game.prototype.onPawnAdded = function (_pawn) {
      var hud = this.getHUD();
      if (hud) {
        hud.onPawnAdded(_pawn);
      }
    };
    State_Game.prototype.onPawnRemoved = function (_pawn) {
      var hud = this.getHUD();
      if (hud) {
        hud.onPawnRemoved(_pawn);
      }
    };
    State_Game.prototype.removeFromWorld = function (_item) {
      this.layerWorld.remove(_item);
    };
    State_Game.prototype.removeBody = function (_body) {
      _body.data.SetUserData(null);
      _body.destroy();
      try {
        this.game.physics.box2d.world.DestroyBody(_body);
      } catch (e) {
        console.error(e);
      }
      //this.bodies.splice(this.bodies.indexOf(_body), 1);
    };
    State_Game.prototype.destroyJoint = function (_joint) {
      if (!this.queue || !_joint) {
        return;
      }
      this.queue.push(_joint);
    };
    State_Game.prototype.destroyGame = function () {
      this.bPendingDestroy = true;
      TWP2.SoundManager.DestroyAmbience();
      this.shells = null;
      this.debris = null;
      while (this.emitters.length > 0) {
        this.emitters[0].destroy();
        this.emitters.splice(0, 1);
      }
      this.emitters = null;
      while (this.objects.length > 0) {
        this.flagObjectForDestruction(this.objects[0]);
        this.objects[0].destroy();
        this.objects.splice(0, 1);
      }
      this.objects = null;
      this.explosions = null;
      while (this.controllers.length > 0) {
        this.controllers[0].destroy();
        this.controllers.splice(0, 1);
      }
      this.controllers = null;
      this.groundBody = null;
      this.decals = null;
      this.pawns = null;
      this.gameMode.destroy();
      this.gameMode = null;
      this.cameraTarget = null;
      this.controllers = null;
      this.objectsToDestroy = null;
      this.queue = null;
      this.muzzleFlashes = null;
      this.smokes = null;
      this.worldFilters = null;
      this.player = null;
      this.playerController = null;
      if (this.pauseMenu) {
        this.pauseMenu.destroy();
        this.pauseMenu = null;
      }
      TWP2.GameUtil.game.ui.remove(this.layerUI);
      TWP2.GameUtil.game.ui.remove(this.layerPauseMenu);
      this.layerWorld.removeAll(true);
      this.layerWorld.destroy();
      this.layerWorld = null;
      this.layerUI.destroy();
      this.layerUI = null;
      this.layerPauseMenu.destroy();
      this.layerPauseMenu = null;
    };
    State_Game.prototype.getGroundBody = function () {
      return this.groundBody;
    };
    State_Game.prototype.shakeCamera = function (_val, _bScale) {
      if (_bScale === void 0) {
        _bScale = true;
      }
      this.game.camera.x += TWP2.MathUtil.Random(-_val, _val);
      this.game.camera.y += TWP2.MathUtil.Random(-_val, _val);
      if (_bScale) {
        this.addWorldScale(_val * 0.0015);
      }
    };
    State_Game.prototype.setDesiredWorldScale = function (_val) {
      this.targetScale = _val;
    };
    State_Game.prototype.setDesiredWorldScaleMultiplier = function (_val) {
      this.targetScaleModifier = _val;
    };
    State_Game.prototype.updateCamera = function () {
      if (this.cameraTarget) {
        this.targetX = this.cameraTarget.x - this.game.scale.width * 0.1;
        this.targetY = this.cameraTarget.y - this.game.scale.height * 0.6;
        if (this.cameraTarget == this.player) {
          if (!this.gameMode.matchHasEnded()) {
            if (this.player && this.player.isAlive() && this.playerController.canInput()) {
              this.targetX -= -(this.game.input.x * this.cameraMouseLookRatio) + this.game.width * this.cameraMouseLookRatio2;
              this.targetY -= -(this.game.input.y * this.cameraMouseLookRatio) + this.game.height * this.cameraMouseLookRatio2;
            }
          }
        }
        this.game.camera.x -= (this.game.camera.x - this.targetX) * State_Game.CAMERA_SPEED;
        this.game.camera.y -= (this.game.camera.y - this.targetY) * State_Game.CAMERA_SPEED;
      }
      var realTargetScale = this.targetScale * this.targetScaleModifier;
      this.game.world.scale.x -= (this.game.world.scale.x - realTargetScale) * 0.05;
      this.game.world.scale.y = this.game.world.scale.x;
    };
    State_Game.prototype.setCameraTarget = function (_target) {
      this.cameraTarget = _target;
    };
    State_Game.prototype.setPlayerAsCameraTarget = function () {
      if (this.player) {
        this.setCameraTarget(this.player);
      }
    };
    State_Game.prototype.removeController = function (_controller) {
      if (_controller) {
        _controller.destroy();
        this.controllers.splice(this.controllers.indexOf(_controller), 1);
      }
    };
    State_Game.prototype.createPlayerController = function () {
      if (!this.playerController) {
        this.playerController = new TWP2.PlayerController();
        this.controllers.push(this.playerController);
      }
      return this.playerController;
    };
    State_Game.prototype.createPlayerCharacter = function (_y) {
      this.player = new TWP2.Character("player", 180, _y, this.playerController);
      this.objects.push(this.player);
      this.pawns.push(this.player);
      this.setCameraTarget(this.player);
      return this.player;
    };
    State_Game.prototype.createHarrier = function (_x, _y) {
      if (this.pawns.length > 30) {
        this.pawns[1].triggerDestroy();
      }
      var controller = new TWP2.AIController_Harrier();
      this.controllers.push(controller);
      var harrier = new TWP2.Harrier(null, _x, _y, controller);
      this.objects.push(harrier);
      this.pawns.push(harrier);
      return harrier;
    };
    State_Game.prototype.createSoldier = function (_x, _y, _material, _weapon, _speed) {
      if (this.pawns.length > 30) {
        this.pawns[1].triggerDestroy();
      }
      var controller = new TWP2.AIController_Soldier();
      this.controllers.push(controller);
      var soldier = new TWP2.Soldier(null, _x, _y, controller, _material, _weapon, _speed);
      this.objects.push(soldier);
      this.pawns.push(soldier);
      return soldier;
    };
    State_Game.prototype.createTarget = function (_x, _y, _type, _material) {
      if (_type === void 0) {
        _type = TWP2.Target.TYPE_DEFAULT;
      }
      if (_material === void 0) {
        _material = TWP2.Target.MATERIAL_DEFAULT;
      }
      if (this.pawns.length > this.getMaxPawns()) {
        if (this.gameMode && this.gameMode.getAllowTargetRemoval()) {
          this.pawns[1].triggerDestroy();
        }
      }
      var controller = new TWP2.AIController_Target();
      this.controllers.push(controller);
      var target = new TWP2.Target(null, _x, _y, controller, _type, _material);
      this.objects.push(target);
      this.pawns.push(target);
      var lastRope;
      var ropes;
      var baseJoint;
      if (_type == TWP2.Target.TYPE_ROPE) {
        ropes = [];
        var ropeHeight = TWP2.Rope.HEIGHT;
        var numRopes = 5;
        target.getBody().y += numRopes * ropeHeight;
        for (var i = 0; i < numRopes; i++) {
          var x = _x;
          var y = _y + i * ropeHeight - ropeHeight * numRopes;
          var newRope = new TWP2.Rope(x, y, i == 0 ? TWP2.Rope.TYPE_BASE : TWP2.Rope.TYPE_DEFAULT);
          this.objects.push(newRope);
          this.game.physics.box2d.enable(newRope, false);
          var ropeBody = newRope.getBody();
          if (i == 0) {
            ropeBody.static = true;
          } else {
            ropeBody.applyForce(TWP2.MathUtil.Random(-50, 50), 0);
          }
          if (lastRope) {
            var joint = this.game.physics.box2d.revoluteJoint(lastRope, newRope, 0, ropeHeight * 0.5, 0, -(ropeHeight * 0.5));
          }
          lastRope = newRope;
          ropes.push(newRope);
        }
        var targetSprite = target.getBody().sprite;
        this.game.physics.box2d.revoluteJoint(lastRope, targetSprite, 0, ropeHeight * 0.5, 0, -ropeHeight * 0.5);
        target.setRopes(ropes);
      } else if (_type == TWP2.Target.TYPE_ROTATOR) {
        ropes = [];
        var ropeHeight = TWP2.Rope.HEIGHT;
        var numRopes = 3;
        target.getBody().y += numRopes * ropeHeight;
        for (var i = 0; i < numRopes; i++) {
          if (i == 1) {
            ropeHeight = TWP2.Rope.HEIGHT * 4;
          } else {
            ropeHeight = TWP2.Rope.HEIGHT;
          }
          var x = _x;
          var y = _y + i * ropeHeight - ropeHeight * numRopes;
          var ropeType = TWP2.Rope.TYPE_DEFAULT;
          if (i == 0) {
            ropeType = TWP2.Rope.TYPE_BASE;
          } else if (i == 1) {
            ropeType = TWP2.Rope.TYPE_HOLDER;
          }
          var newRope = new TWP2.Rope(x, y, ropeType);
          this.objects.push(newRope);
          this.game.physics.box2d.enable(newRope, false);
          var ropeBody = newRope.getBody();
          if (i == 0) {
            ropeBody.static = true;
          } else {
            ropeBody.applyForce(TWP2.MathUtil.Random(-50, 50), 0);
          }
          if (lastRope) {
            if (i == 1) {
              var speed = TWP2.MathUtil.Random(50, 100);
              if (TWP2.MathUtil.RandomBoolean()) {
                speed = -speed;
              }
              baseJoint = this.game.physics.box2d.revoluteJoint(lastRope, newRope, 0, 0, 0, -newRope.getBody().sprite.height * 0.5, speed, 80, true);
            } else {
              this.game.physics.box2d.revoluteJoint(lastRope, newRope, 0, lastRope.getBody().sprite.height * 0.5, 0, -newRope.getBody().sprite.height * 0.5);
            }
          }
          lastRope = newRope;
          ropes.push(newRope);
        }
        var targetSprite = target.getBody().sprite;
        this.game.physics.box2d.revoluteJoint(lastRope, targetSprite, 0, ropeHeight * 0.5, 0, -ropeHeight * 0.5);
        target.setRopes(ropes);
        if (baseJoint) {
          target.setRopeBaseJoint(baseJoint);
        }
      }
      return target;
    };
    State_Game.prototype.createDebris = function (_x, _y, _rotation, _type) {
      if (TWP2.PlayerUtil.player.settings.bEffects == false) {
        return null;
      }
      var debris = new TWP2.Debris(_x, _y, _rotation, _type);
      this.objects.push(debris);
      this.debris.push(debris);
      if (this.debris.length > State_Game.MAX_DEBRIS) {
        this.debris[0].triggerDestroy();
      }
      return debris;
    };
    State_Game.prototype.createDecal = function (_x, _y, _type) {
      var decal = this.game.add.image(_x, _y, "atlas_objects", _type);
      decal.rotation = TWP2.MathUtil.ToRad(TWP2.MathUtil.Random(-180, 180));
      decal.anchor.set(0.5, 0.5);
      decal.alpha = TWP2.MathUtil.Random(10, 20) * 0.01;
      this.addToWorld(decal, State_Game.INDEX_WALLS);
      this.decals.push(decal);
      if (this.decals.length > State_Game.MAX_DECALS) {
        this.decals[0].destroy();
        this.decals.splice(0, 1);
      }
      return decal;
    };
    State_Game.prototype.createExplosion = function (_x, _y, _radius, _instigator, _causer, _data) {
      var damage = _data["damage"];
      var bRound = _data["bRound"];
      if (!bRound || TWP2.MathUtil.RandomBoolean()) {
        this.createDecal(_x, _y, "decal_crater");
      }
      this.createSmoke(_x, _y, -90 * TWP2.MathUtil.TO_RADIANS, TWP2.Smoke.SMOKE_DEFAULT);
      //this.createMuzzleFlash(_x, _y, -90 * MathUtil.TO_RADIANS);
      var rect = new Phaser.Rectangle(_x, _y, _radius * 2, _radius * 2);
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffcc, 1);
      gfx.lineStyle(8, 0xffffff, 1);
      gfx.drawCircle(0, 0, _radius * 2);
      gfx.endFill();
      var explosion = this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      explosion.alpha = bRound ? 0.4 : 1;
      explosion.x = rect.x;
      explosion.y = rect.y;
      explosion.anchor.set(0.5, 0.5);
      this.addToWorld(explosion, State_Game.INDEX_PAWNS);
      var tween = this.game.add.tween(explosion).to({ alpha: 0 }, 200, Phaser.Easing.Exponential.Out, true);
      var tween = this.game.add.tween(explosion.scale).from({ x: 0.8, y: 0.8 }, 200, Phaser.Easing.Back.Out, true);
      this.explosions.push(explosion);
      var bShotHit = false;
      var curActor = null;
      var curPawn = null;
      var distMult = 1;
      var distFromCenter = 0;
      var numKills = 0;
      for (var i = 0; i < this.objects.length; i++) {
        curActor = null;
        curPawn = null;
        var curObject = this.objects[i];
        if (curObject.getBody()) {
          if (curObject instanceof TWP2.Actor) {
            curActor = curObject;
            if (curActor instanceof TWP2.Pawn) {
              curPawn = curActor;
            }
          }
          if (curActor instanceof TWP2.Bullet) {
            //break;
          }
          distMult = 1;
          distFromCenter = TWP2.MathUtil.Dist(rect.x, rect.y, curObject.x, curObject.y);
          if (distFromCenter <= _radius) {
            distMult = 1 - distFromCenter / _radius;
            var damageAmount = damage * distMult;
            var force = Math.min(damageAmount * 2, 500);
            if (curActor instanceof TWP2.ProjectileBase) {
              force *= 0.1;
            } else if (curActor instanceof TWP2.Harrier) {
              force *= 0.1;
              if (!bRound) {
                damageAmount *= 5;
              }
            }
            if (curObject instanceof TWP2.Rope) {
              force = 0;
              damageAmount = 0;
            }
            if (distFromCenter > _radius * 0.8) {
              damageAmount *= 0.2;
            }
            if (distFromCenter > _radius * 0.5) {
              damageAmount *= 0.5;
            } else if (distFromCenter > _radius * 0.2) {
              damageAmount *= 0.8;
            }
            var distX = curObject.x - _causer.x;
            var distY = curObject.y - _causer.y;
            var rad = Math.atan2(distY, distX);
            var vx = Math.cos(rad) * force;
            var vy = Math.sin(rad) * force;
            if (vx != 0 && vy != 0) {
              curObject.getBody().applyForce(vx, vy);
            }
            var rotAmount = damageAmount * 2;
            if (rotAmount != 0) {
              if (curActor instanceof TWP2.Harrier) {
                rotAmount *= 0.1;
              }
              if (TWP2.MathUtil.RandomBoolean()) {
                curObject.getBody().rotateLeft(TWP2.MathUtil.Random(rotAmount * 0.1, rotAmount));
              } else {
                curObject.getBody().rotateRight(TWP2.MathUtil.Random(rotAmount * 0.1, rotAmount));
              }
            }
            if (curActor != null) {
              curActor.takeDamage(damageAmount, _instigator, _causer, TWP2.DamageType.DAMAGE_TYPE_EXPLOSIVE, false);
              if (!bShotHit) {
                if (!bRound) {
                  this.getGameMode().addShotsHit();
                }
                bShotHit = true;
              }
              if (!curActor.isAlive()) {
                numKills++;
              }
            }
          }
        }
      }
      if (numKills >= 2) {
        if (_instigator instanceof TWP2.PlayerController) {
          this.getPlayerController().onMultiKill(numKills);
        }
      }
      var sfx = bRound ? "explosion_round" : "explosion";
      TWP2.SoundManager.PlayWorldSound(sfx, _x, _y, 3, bRound ? 1 : 2);
      if (!bRound) {
        var dist = Math.min(100, Math.max(10, 100 - TWP2.MathUtil.Dist(this.player.x, this.player.y, _x, _y) * 0.1));
        this.world.camera.x += TWP2.MathUtil.Random(dist * 0.8, dist) * (TWP2.MathUtil.RandomBoolean() ? 1 : -1);
        this.world.camera.y += TWP2.MathUtil.Random(dist * 0.8, dist) * (TWP2.MathUtil.RandomBoolean() ? 1 : -1);
      }
    };
    State_Game.prototype.addWorldScale = function (_val) {
      this.world.scale.x = Math.max(0.6, this.world.scale.x + _val);
      this.world.scale.y = this.world.scale.x;
    };
    State_Game.prototype.createMuzzleFlash = function (_x, _y, _rotation, _type, _scale, _bForceFlash) {
      if (_type === void 0) {
        _type = "default";
      }
      if (_scale === void 0) {
        _scale = 1;
      }
      if (_bForceFlash === void 0) {
        _bForceFlash = false;
      }
      var smoke;
      if (_type == "default") {
        if (TWP2.MathUtil.RandomBoolean() || _bForceFlash) {
          var muzzleFlash = this.game.add.image(_x, _y, "atlas_effects", "muzzleFlash_" + TWP2.MathUtil.Random(1, 9));
          muzzleFlash.anchor.set(0, 0.5);
          muzzleFlash.scale.x = TWP2.MathUtil.Random(6, 15) * 0.1 * _scale;
          muzzleFlash.scale.y = _scale * (TWP2.MathUtil.RandomBoolean() ? 1 : -1);
          muzzleFlash.rotation = _rotation + TWP2.MathUtil.Random(-3, 3) * TWP2.MathUtil.TO_RADIANS;
          this.addToWorld(muzzleFlash, State_Game.INDEX_PAWNS);
          this.muzzleFlashes.push(muzzleFlash);
        }
        smoke = this.createSmoke(_x, _y, _rotation, TWP2.Smoke.SMOKE_MUZZLE);
      } else if (_type == "suppressor") {
        smoke = this.createSmoke(_x, _y, _rotation, TWP2.Smoke.SMOKE_MUZZLE);
      } else if (_type == "impact") {
        smoke = this.createSmoke(_x, _y, _rotation, TWP2.Smoke.SMOKE_IMPACT);
      }
      if (TWP2.PlayerUtil.player.settings.bEffects != false) {
        var sparkString = "sparks_" + TWP2.MathUtil.Random(1, 5);
        var sparkScaleMin = 8;
        var sparkScaleMax = 15;
        if (_type == "impact") {
          sparkString = "sparks_impact_" + TWP2.MathUtil.Random(1, 4);
          sparkScaleMin = 6;
          sparkScaleMax = 12;
        }
        var sparks = this.game.add.image(_x, _y, "atlas_effects", sparkString);
        sparks.anchor.set(0, 0.5);
        sparks.rotation = _rotation + TWP2.MathUtil.Random(-15, 15) * TWP2.MathUtil.TO_RADIANS;
        sparks.scale.x = TWP2.MathUtil.Random(sparkScaleMin, sparkScaleMax) * 0.1 * _scale;
        sparks.scale.y = TWP2.MathUtil.Random(sparkScaleMin, sparkScaleMax) * 0.1 * _scale;
        sparks.alpha = TWP2.MathUtil.Random(80, 100) * 0.01;
        this.addToWorld(sparks, State_Game.INDEX_PAWNS);
        this.muzzleFlashes.push(sparks);
      }
    };
    State_Game.prototype.createProjectile = function (_x, _y, _rotation, _type, _causer, _instigator, _data) {
      var projectile;
      if (_type == TWP2.ProjectileBase.TYPE_BULLET) {
        projectile = new TWP2.Bullet(_x, _y, _rotation, _causer, _instigator, _data);
        //this.createBullet(_x, _y, _rotation, _data);
      } else if (_type == TWP2.ProjectileBase.TYPE_ROCKET) {
        projectile = new TWP2.Rocket(_x, _y, _rotation, _causer, _instigator, _data);
      } else if (_type == TWP2.ProjectileBase.TYPE_GRENADE) {
        projectile = new TWP2.Grenade(_x, _y, _rotation, _causer, _instigator, _data);
      }
      if (!projectile) {
        return null;
      }
      this.objects.push(projectile);
      return projectile;
    };
    State_Game.prototype.createBullet = function (_x, _y, _rotation, _data) {
      var dist = 1200;
      var rad = _rotation;
      var endX = _x + Math.cos(rad) * dist;
      var endY = _y + Math.sin(rad) * dist;
      var raycast = this.game.physics.box2d.raycast(_x, _y, endX, endY, true, TWP2.GameUtil.FilterRaycastHit);
      if (raycast.length > 0) {
        var hit = raycast[0];
        endX = hit.point.x;
        endY = hit.point.y;
        this.handleBulletImpact(hit, _rotation, _data);
      }
      var gfx = this.game.add.graphics();
      gfx.lineStyle(4, 0xffffcc, 0.1);
      gfx.moveTo(_x, _y);
      gfx.lineTo(endX, endY);
      this.addToWorld(gfx);
      this.muzzleFlashes.push(gfx);
    };
    State_Game.prototype.handleBulletImpact = function (_hitData, _rotation, _data) {
      var impactType = "impact";
      var body = _hitData["body"];
      if (body) {
        var userData = body.data.GetUserData();
        if (userData) {
          var worldObject = userData ? userData["worldObject"] : null;
          if (worldObject) {
            var actor = worldObject instanceof TWP2.Actor ? worldObject : null;
            if (actor) {
              var pawn = actor instanceof TWP2.Pawn ? actor : null;
              if (pawn) {
                impactType = "blood";
                var instigator = _data["instigator"];
                //pawn.takeDamage(_data["damage"], _data["instigator"], _data["causer"], DamageType.DAMAGE_TYPE_BULLET);
                if (instigator == this.playerController) {
                  this.playerController.onEnemyHit();
                }
              } else {
                //actor.takeDamage(_data["damage"], _data["instigator"], null, DamageType.DAMAGE_TYPE_BULLET);
              }
            }
          }
        }
      }
      this.createImpactEffect(_hitData.point.x, _hitData.point.y, _rotation + TWP2.MathUtil.ToRad(180), impactType);
    };
    State_Game.prototype.createImpactEffect = function (_x, _y, _rotation, _type) {
      if (_type == "impact") {
        this.createSmoke(_x, _y, _rotation, TWP2.Smoke.SMOKE_IMPACT);
        var sparks = this.game.add.image(_x, _y, "atlas_effects", "sparks_" + TWP2.MathUtil.Random(1, 3));
        sparks.anchor.set(0, 0.5);
        sparks.rotation = _rotation + TWP2.MathUtil.Random(-15, 15) * TWP2.MathUtil.TO_RADIANS;
        sparks.scale.x = TWP2.MathUtil.Random(8, 12) * 0.1;
        sparks.scale.y = TWP2.MathUtil.Random(8, 12) * 0.1;
        this.addToWorld(sparks);
        this.muzzleFlashes.push(sparks);
      } else if (_type == "blood") {
        var sparks = this.game.add.image(_x, _y, "atlas_effects", "sparks_" + TWP2.MathUtil.Random(1, 3));
        sparks.tint = 0xcc0000;
        sparks.anchor.set(0, 0.5);
        sparks.rotation = _rotation + TWP2.MathUtil.Random(-15, 15) * TWP2.MathUtil.TO_RADIANS;
        sparks.scale.x = TWP2.MathUtil.Random(8, 12) * 0.1;
        sparks.scale.y = TWP2.MathUtil.Random(8, 12) * 0.1;
        this.addToWorld(sparks);
        this.muzzleFlashes.push(sparks);
      }
    };
    State_Game.prototype.createSmoke = function (_x, _y, _rotation, _type) {
      if (TWP2.PlayerUtil.player.settings.bEffects == false) {
        return null;
      }
      var smoke = new TWP2.Smoke(_type);
      smoke.position.set(_x, _y);
      smoke.rotation = _rotation;
      this.smokes.push(smoke);
      return smoke;
    };
    State_Game.prototype.destroySmoke = function (_smoke) {
      var index = this.smokes.indexOf(_smoke);
      this.smokes[index].destroy();
      this.smokes.splice(index, 1);
    };
    State_Game.prototype.createShell = function (_x, _y, _rotation, _type) {
      if (TWP2.PlayerUtil.player.settings.bShells == false) {
        return null;
      }
      var shell = new TWP2.Shell(_x, _y, _rotation, _type);
      this.objects.push(shell);
      this.shells.push(shell);
      if (this.shells.length > State_Game.MAX_SHELLS) {
        this.shells[0].triggerDestroy();
      }
      return shell;
    };
    State_Game.prototype.createMag = function (_x, _y, _rotation, _type) {
      if (TWP2.PlayerUtil.player.settings.bMags == false) {
        return null;
      }
      var mag = new TWP2.Mag(_x, _y, _rotation, _type);
      this.objects.push(mag);
      return mag;
    };
    State_Game.prototype.setWorldBlur = function (_bVal) {
      this.worldFilters["blur"]["bEnabled"] = _bVal;
      this.updateWorldFilters();
    };
    State_Game.prototype.setWorldGray = function (_bVal) {
      this.worldFilters["gray"]["bEnabled"] = _bVal;
      this.updateWorldFilters();
    };
    State_Game.prototype.updateWorldFilters = function () {
      var filters = [];
      var bEnableFilters = true;
      if (bEnableFilters) {
        if (this.worldFilters["blur"]["bEnabled"] == true) {
          var blurX = this.add.filter("BlurX");
          var blurY = this.add.filter("BlurY");
          blurX.blur = blurY.blur = 24;
          filters.push(blurX);
          filters.push(blurY);
        }
        if (this.worldFilters["gray"]["bEnabled"] == true) {
          var gray = this.add.filter("Gray");
          //gray.gray = 0.9;
          filters.push(gray);
        }
      }
      if (filters.length == 0) {
        this.layerWorld.filters = undefined;
      } else {
        this.layerWorld.filters = filters;
      }
    };
    State_Game.prototype.destroyBody = function (_body) {
      if (!this.queue || !_body) {
        return;
      }
      this.queue.push(_body);
    };
    State_Game.prototype.addCollisionToQueue = function (_objA, _objB) {
      if (!this.queue) {
        return;
      }
      this.queue.push([_objA, _objB]);
    };
    State_Game.prototype.addCollisionDataToQueue = function (_objA, _objB) {
      if (!this.queue) {
        return;
      }
      this.queue.push([_objA, _objB]);
    };
    State_Game.prototype.onCollide = function (_objA, _objB) {
      if (_objA) {
        if (!_objA.isPendingDestroy()) {
          _objA.onHit(_objB, null);
        }
      }
      if (_objB) {
        if (!_objB.isPendingDestroy()) {
          _objB.onHit(_objA, null);
        }
      }
    };
    State_Game.prototype.onCollideData = function (_objA, _objB) {
      var worldObjectA = null;
      var worldObjectB = null;
      if (_objA) {
        worldObjectA = _objA["worldObject"];
      }
      if (_objB) {
        worldObjectB = _objB["worldObject"];
      }
      if (worldObjectA) {
        if (!worldObjectA.isPendingDestroy()) {
          worldObjectA.onHit(worldObjectB, _objB);
        }
      }
      if (worldObjectB) {
        if (!worldObjectB.isPendingDestroy()) {
          worldObjectB.onHit(worldObjectA, _objA);
        }
      }
    };
    State_Game.prototype.flagObjectForDestruction = function (_obj) {
      var index = this.objects.indexOf(_obj);
      if (index >= 0) {
        if (!this.objects[index].isPendingDestroy()) {
          this.objects[index].setPendingDestroy();
          this.objectsToDestroy.push(this.objects[index]);
        }
      }
    };
    State_Game.prototype.getHUD = function () {
      return this.playerController.getHUD();
    };
    State_Game.prototype.getPlayerController = function () {
      return this.playerController;
    };
    State_Game.prototype.getPlayerPawn = function () {
      return this.playerController.getPawn();
    };
    State_Game.prototype.getPlayerCharacter = function () {
      return this.playerController.getPawn();
    };
    State_Game.prototype.getGameMode = function () {
      return this.gameMode;
    };
    State_Game.MAX_SHELLS = 25;
    State_Game.MAX_DEBRIS = 6;
    State_Game.MAX_DEAD_PAWNS = 5;
    State_Game.MAX_DECALS = 20;
    State_Game.DEBRIS_ALPHA = 0.25;
    State_Game.CAMERA_SPEED = 0.05;
    State_Game.INDEX_WALLS = 0;
    State_Game.INDEX_MAGS = 1;
    State_Game.INDEX_SHELLS = 2;
    State_Game.INDEX_PAWNS = 3;
    State_Game.INDEX_LASER = 4;
    State_Game.INDEX_LAVA = 5;
    State_Game.INDEX_UI = 6;
    State_Game.CATEGORY_PROJECTILES = 1;
    State_Game.CATEGORY_OBJECTS = 2;
    State_Game.CATEGORY_SHELLS = 4;
    State_Game.CATEGORY_WALLS = 8;
    State_Game.CATEGORY_SOLDIERS = 16;
    State_Game.MASK_WALLS = State_Game.CATEGORY_WALLS;
    State_Game.MASK_PROJECTILES = State_Game.CATEGORY_WALLS | State_Game.CATEGORY_OBJECTS | State_Game.CATEGORY_SOLDIERS;
    State_Game.MASK_OBJECTS = State_Game.CATEGORY_WALLS | State_Game.CATEGORY_OBJECTS;
    State_Game.MASK_PAWNS = State_Game.CATEGORY_WALLS | State_Game.CATEGORY_OBJECTS | State_Game.CATEGORY_PROJECTILES;
    return State_Game;
  })(Phaser.State);
  TWP2.State_Game = State_Game;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var State_Intro = /** @class */ (function (_super) {
    __extends(State_Intro, _super);
    function State_Intro() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    State_Intro.prototype.create = function () {
      this.container = this.game.add.group();
      var gfx = this.game.add.graphics(0, 0);
      gfx.beginFill(0x000000, 1);
      gfx.drawRect(0, 0, this.game.width, this.game.height);
      this.bg = this.game.add.sprite(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.container.add(this.bg);
      var gradient = this.game.add.image(0, 0, "gradient");
      this.container.add(gradient);
      var animator = this.createAnimator();
      animator.x = this.game.width * 0.5;
      animator.y = this.game.height * 0.5 - 30;
      this.container.add(animator);
      var tween = this.game.add.tween(animator).from({ alpha: 0 }, 3000, Phaser.Easing.Exponential.Out, true);
      this.items = this.game.add.group();
      this.items.y = -30;
      this.container.add(this.items);
      var xPadding = this.bg.width * 0.5;
      var yPadding = 18;
      this.logoTop = this.game.add.image(0, 0, "xwilkinx_logo_half");
      this.logoTop.alpha = 0;
      this.logoTop.anchor.set(0.5, 0.5);
      this.logoTop.x = this.bg.width * 0.5 - xPadding;
      this.logoTop.y = this.bg.height * 0.5 - yPadding;
      this.items.add(this.logoTop);
      this.logoBottom = this.game.add.image(0, 0, "xwilkinx_logo_half");
      this.logoBottom.alpha = 0;
      this.logoBottom.anchor.set(0.5, 0.5);
      this.logoBottom.rotation = 180 * TWP2.MathUtil.TO_RADIANS;
      this.logoBottom.x = this.bg.width * 0.5 + xPadding;
      this.logoBottom.y = this.bg.height * 0.5 + yPadding;
      this.items.add(this.logoBottom);
      this.wilkinText = this.game.add.text(0, 0, "Wilkin Games", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      this.wilkinText.alpha = 0;
      this.wilkinText.anchor.set(0.5, 0.5);
      this.wilkinText.x = this.bg.width * 0.5;
      this.wilkinText.y = this.game.height; //this.logoBottom.y + this.logoBottom.height + 30;
      this.items.add(this.wilkinText);
      this.gamesText = this.game.add.text(0, 0, "Game Development Since 2010", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", align: "center" });
      this.gamesText.alpha = 0;
      this.gamesText.anchor.set(0.5, 0.5);
      this.gamesText.x = this.wilkinText.x;
      this.gamesText.y = this.wilkinText.y;
      this.items.add(this.gamesText);
      this.overlay = this.game.add.graphics(0, 0);
      this.overlay.beginFill(0x000000, 1);
      this.overlay.drawRect(0, 0, this.game.width, this.game.height);
      this.container.add(this.overlay);
      var tween = this.game.add.tween(this.overlay).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true);
      this.start();
      this.bg.inputEnabled = true;
      this.bg.events.onInputUp.add(this.onClicked, this);
    };
    State_Intro.prototype.createAnimator = function () {
      var group = this.game.add.group();
      var rad = 45;
      var colour = TWP2.ColourUtil.COLOUR_RED;
      var lineSize = 4;
      var gfx = this.game.add.graphics();
      gfx.lineStyle(4, 0xffffff, 0.1);
      gfx.drawCircle(0, 0, 80);
      group.add(gfx);
      var gfx = this.game.add.graphics();
      gfx.lineStyle(lineSize, colour, 0.3);
      gfx.arc(0, 0, 40, TWP2.MathUtil.ToRad(rad), TWP2.MathUtil.ToRad(rad + rad), false);
      group.add(gfx);
      var tween = this.game.add.tween(gfx).to({ rotation: TWP2.MathUtil.ToRad(-360) }, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
      var gfx = this.game.add.graphics();
      gfx.lineStyle(lineSize, 0xffffff, 0.1);
      gfx.drawCircle(0, 0, 60);
      group.add(gfx);
      var gfx = this.game.add.graphics();
      gfx.lineStyle(lineSize, colour, 0.3);
      gfx.arc(0, 0, 30, 0, TWP2.MathUtil.ToRad(rad), false);
      group.add(gfx);
      var tween = this.game.add.tween(gfx).to({ rotation: TWP2.MathUtil.ToRad(360) }, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
      var gfx = this.game.add.graphics();
      gfx.lineStyle(lineSize, 0xffffff, 0.1);
      gfx.drawCircle(0, 0, 40);
      group.add(gfx);
      var gfx = this.game.add.graphics();
      gfx.lineStyle(lineSize, colour, 0.3);
      gfx.arc(0, 0, 20, 0, TWP2.MathUtil.ToRad(rad), false);
      group.add(gfx);
      var tween = this.game.add.tween(gfx).to({ rotation: TWP2.MathUtil.ToRad(-360) }, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
      return group;
    };
    State_Intro.prototype.onClicked = function () {
      if (TWP2.GameUtil.IsDebugging()) {
        this.closeIntro();
      } else {
        TWP2.GameUtil.OpenWilkinHomepage();
      }
    };
    State_Intro.prototype.start = function () {
      this.soundFx = TWP2.SoundManager.PlayUISound("ui_xwilkinx");
      var speed = 800;
      var delay = 250;
      var tween = this.game.add.tween(this.logoTop).to({ x: this.bg.width * 0.5 }, speed, Phaser.Easing.Exponential.Out, true);
      var tween = this.game.add.tween(this.logoTop).to({ alpha: 1 }, speed, Phaser.Easing.Exponential.Out, true);
      var tween = this.game.add.tween(this.logoBottom).to({ x: this.bg.width * 0.5 }, speed, Phaser.Easing.Exponential.Out, true);
      var tween = this.game.add.tween(this.logoBottom).to({ alpha: 1 }, speed, Phaser.Easing.Exponential.Out, true);
      var desiredWilkinTextY = this.logoBottom.y + this.logoBottom.height * 0.5 + 24;
      var tween = this.game.add.tween(this.wilkinText).to({ alpha: 1 }, speed, Phaser.Easing.Exponential.Out, true, delay);
      var tween = this.game.add.tween(this.wilkinText).to({ y: desiredWilkinTextY }, speed, Phaser.Easing.Exponential.Out, true, delay);
      var tween = this.game.add.tween(this.gamesText).to({ alpha: 0.8 }, speed, Phaser.Easing.Exponential.Out, true, delay * 2);
      var tween = this.game.add.tween(this.gamesText).to({ y: desiredWilkinTextY + this.wilkinText.height * 0.5 + 8 }, speed, Phaser.Easing.Exponential.Out, true, delay * 2);
      tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_3");
    };
    State_Intro.prototype.end = function () {
      var tween = this.game.add.tween(this.overlay).to({ alpha: 1 }, 2000, Phaser.Easing.Quintic.InOut, true, 800);
      tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_4");
    };
    State_Intro.prototype.onTweenComplete = function (_currentTarget, _currentTween, _id) {
      if (_id == "tween_3") {
        var timer = this.game.time.create(true);
        timer.add(1500, this.end, this);
        timer.start();
      } else if (_id == "tween_4") {
        this.closeIntro();
      }
    };
    State_Intro.prototype.closeIntro = function () {
      if (this.soundFx) {
        this.soundFx.stop();
      }
      TWP2.GameUtil.game.loadMenu(null);
    };
    return State_Intro;
  })(Phaser.State);
  TWP2.State_Intro = State_Intro;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var State_Menu = /** @class */ (function (_super) {
    __extends(State_Menu, _super);
    function State_Menu() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    State_Menu.prototype.init = function (_menuId, _data) {
      this.menuId = _menuId;
      this.data = _data;
    };
    State_Menu.prototype.create = function () {
      if (!this.menuId) {
        this.loadSplashMenu();
      } else {
        this.loadMainMenu(this.menuId);
      }
      TWP2.SoundManager.PlayMusic("music_menu");
    };
    State_Menu.prototype.loadSplashMenu = function () {
      this.splashMenu = new TWP2.SplashMenu();
      this.splashMenu.setOnCloseCallback(this.loadMainMenu, this, [TWP2.MainMenu.MENU_MAIN]);
    };
    State_Menu.prototype.loadMainMenu = function (_menuId) {
      if (_menuId === void 0) {
        _menuId = TWP2.MainMenu.MENU_MAIN;
      }
      this.mainMenu = new TWP2.MainMenu();
      this.mainMenu.loadMenu(_menuId);
    };
    State_Menu.prototype.loadPreGameMenu = function (_data) {
      if (this.mainMenu) {
        this.mainMenu.destroy();
        this.mainMenu = null;
      }
      this.preGameMenu = new TWP2.PreGameMenu(_data);
    };
    State_Menu.prototype.getMainMenu = function () {
      return this.mainMenu;
    };
    State_Menu.prototype.getSplashMenu = function () {
      return this.splashMenu;
    };
    State_Menu.prototype.getPreGameMenu = function () {
      return this.preGameMenu;
    };
    return State_Menu;
  })(Phaser.State);
  TWP2.State_Menu = State_Menu;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var State_Preloader = /** @class */ (function (_super) {
    __extends(State_Preloader, _super);
    function State_Preloader() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.bComplete = false;
      _this.bStartGame = false;
      return _this;
    }
    State_Preloader.prototype.init = function () {
      var gfx = this.game.add.graphics(0, 0);
      gfx.beginFill(0xff0000, 0);
      gfx.drawRect(0, 0, this.game.width, this.game.height);
      this.bg = this.game.add.sprite(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.bg.visible = false;
      this.container = this.game.add.group();
      this.loadBar = new TWP2.UIBar({
        w: this.game.width * 0.9,
        h: 4,
        blocks: 6,
        bHideBarEdge: true,
        bInterpColour: true,
        colours: [0x999999, 0x999999, TWP2.ColourUtil.COLOUR_GREEN],
      });
      this.container.add(this.loadBar);
      this.spinner = TWP2.GameUtil.CreateSpinner();
      this.spinner.x = this.loadBar.width * 0.5;
      this.loadBar.y = this.spinner.y + this.spinner.height * 0.5 + 20;
      this.container.add(this.spinner);
      this.loadText = this.game.add.text(0, 0, "Loading assets, please wait...", { font: "12px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      this.loadText.setTextBounds(0, 0, this.loadBar.width, 20);
      this.loadText.y = this.loadBar.y + 20;
      this.container.add(this.loadText);
      this.fileText = this.game.add.text(0, 0, "", { font: "10px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      this.fileText.setTextBounds(0, 0, this.loadBar.width, 20);
      this.fileText.alpha = 0.2;
      this.fileText.y = this.loadText.y + 20;
      this.container.add(this.fileText);
      //var tween = this.game.add.tween(this.loadText).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
      this.container.x = this.game.width * 0.5 - this.container.width * 0.5;
      this.container.y = this.game.height * 0.5 - this.container.height * 0.5 + 40;
      var titleText = this.game.add.text(0, 0, "Tactical Weapon Pack 2", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(titleText);
      titleText.x = this.game.width * 0.5 - titleText.width * 0.5;
      titleText.y = this.container.y - titleText.height - 50;
      var versionInfo = this.game.add.text(0, 0, TWP2.GameUtil.GetVersionNumber(), { font: "12px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF" });
      versionInfo.alpha = 0.2;
      versionInfo.x = this.game.width * 0.5 - versionInfo.width * 0.5;
      versionInfo.y = titleText.y + titleText.height - 2;
      this.load.onFileStart.add(this.fileUpdate, this);
      var copyrightText = this.game.add.text(0, 0, "\u00A9 2019 Wilkin Games", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      copyrightText.alpha = 0.2;
      copyrightText.x = this.game.width * 0.5 - copyrightText.width * 0.5;
      copyrightText.y = this.game.height - copyrightText.height;
      this.load.onFileStart.add(this.fileUpdate, this);
      //AdUtil.ShowAnchorAd();
    };
    State_Preloader.prototype.preload = function () {
      this.load.json("json_tips", "assets/json/tips.json");
      this.load.atlas("atlas_ui", "assets/images/ui/atlas_ui.png", "assets/images/ui/atlas_ui.json");
      this.load.atlas("atlas_weapons_icons_small", "assets/images/ui/atlas_weapons_icons_small.png", "assets/images/ui/atlas_weapons_icons_small.json");
      this.load.atlas("atlas_mods", "assets/images/weapons/atlas_mods.png", "assets/images/weapons/atlas_mods.json");
      this.load.atlas("atlas_effects", "assets/images/game/atlas_effects.png", "assets/images/game/atlas_effects.json");
      this.load.atlas("atlas_objects", "assets/images/game/atlas_objects.png", "assets/images/game/atlas_objects.json");
      this.load.atlas("atlas_lava", "assets/images/game/atlas_lava.png", "assets/images/game/atlas_lava.json");
      this.load.image("splash_1", "assets/images/bg/splash_1.jpg");
      this.load.image("splash_2", "assets/images/bg/splash_2.jpg");
      this.load.image("splash_3", "assets/images/bg/splash_3.jpg");
      this.load.image("highlight", "assets/images/bg/highlight.png");
      this.load.image("wallpaper", "assets/images/bg/wallpaper.jpg");
      this.load.image("background_shield", "assets/images/bg/background_shield.jpg");
      this.load.image("smoke", "assets/images/bg/smoke.png");
      this.load.image("tiles", "assets/images/bg/tiles.jpg");
      this.load.image("blocker", "assets/images/bg/blocker.png");
      this.load.image("gradient", "assets/images/bg/gradient.png");
      this.load.image("xwilkinx_logo_half", "assets/images/xwilkinx/xwilkinx_logo_half.png");
      this.load.image("logo", "assets/images/ui/logo.png");
      this.load.image("sponsor_ag", "assets/images/sponsors/sponsor_ag.png");
      this.load.image("sponsor_ag_small", "assets/images/sponsors/sponsor_ag_small.png");
      this.load.image("sponsor_ag_button", "assets/images/sponsors/sponsor_ag_button.png");
      var weapons = TWP2.WeaponDatabase.GetAllIds();
      for (var i = 0; i < weapons.length; i++) {
        var id = weapons[i];
        var atlasId = "atlas_" + id;
        this.load.atlas(atlasId, "assets/images/weapons/" + atlasId + ".png", "assets/images/weapons/" + atlasId + ".json");
        this.load.audio("wpn_fire_" + id, "assets/sounds/weapons/wpn_fire_" + id + ".mp3");
      }
      this.load.audio("wpn_loadout_select_1", "assets/sounds/weapons/wpn_loadout_select_1.mp3");
      this.load.audio("wpn_loadout_select_2", "assets/sounds/weapons/wpn_loadout_select_2.mp3");
      this.load.audio("wpn_loadout_select_3", "assets/sounds/weapons/wpn_loadout_select_3.mp3");
      this.load.audio("wpn_gear_1", "assets/sounds/weapons/wpn_gear_1.mp3");
      this.load.audio("wpn_gear_2", "assets/sounds/weapons/wpn_gear_2.mp3");
      this.load.audio("wpn_gear_3", "assets/sounds/weapons/wpn_gear_3.mp3");
      this.load.audio("wpn_grenade_tick", "assets/sounds/weapons/wpn_grenade_tick.mp3");
      this.load.audio("wpn_fire_suppressor_pistol", "assets/sounds/weapons/wpn_fire_suppressor_pistol.mp3");
      this.load.audio("wpn_fire_suppressor_smg", "assets/sounds/weapons/wpn_fire_suppressor_smg.mp3");
      this.load.audio("wpn_fire_suppressor_rifle", "assets/sounds/weapons/wpn_fire_suppressor_rifle.mp3");
      this.load.audio("wpn_fire_suppressor_sniper", "assets/sounds/weapons/wpn_fire_suppressor_sniper.mp3");
      this.load.audio("wpn_fire_suppressor_shotgun", "assets/sounds/weapons/wpn_fire_suppressor_shotgun.mp3");
      this.load.audio("wpn_fire_suppressor_lmg", "assets/sounds/weapons/wpn_fire_suppressor_lmg.mp3");
      this.load.audio("wpn_fire_harrier", "assets/sounds/weapons/wpn_fire_harrier.mp3");
      this.load.audio("vehicle_harrier_idle", "assets/sounds/vehicles/vehicle_harrier_idle.mp3");
      this.load.audio("vehicle_harrier_destroy", "assets/sounds/vehicles/vehicle_harrier_destroy.mp3");
      this.load.audio("music_menu", "assets/sounds/music/music_menu.mp3");
      this.load.audio("music_game_1", "assets/sounds/music/music_game_1.mp3");
      this.load.audio("music_game_lobby", "assets/sounds/music/music_game_lobby.mp3");
      this.load.audio("music_ag", "assets/sounds/music/music_ag.mp3");
      this.load.audio("amb_room", "assets/sounds/ambience/amb_room.mp3");
      this.load.audio("ui_purchase", "assets/sounds/ui/ui_purchase.mp3");
      this.load.audio("ui_prestige", "assets/sounds/ui/ui_prestige.mp3");
      this.load.audio("ui_star", "assets/sounds/ui/ui_star.mp3");
      this.load.audio("ui_error", "assets/sounds/ui/ui_error.mp3");
      this.load.audio("ui_confirm", "assets/sounds/ui/ui_confirm.mp3");
      this.load.audio("ui_button_click", "assets/sounds/ui/ui_button_click.mp3");
      this.load.audio("ui_button_over", "assets/sounds/ui/ui_button_over.mp3");
      this.load.audio("ui_point", "assets/sounds/ui/ui_point.mp3");
      this.load.audio("ui_game_prepare", "assets/sounds/ui/ui_game_prepare.mp3");
      this.load.audio("ui_game_start", "assets/sounds/ui/ui_game_start.mp3");
      this.load.audio("ui_game_end", "assets/sounds/ui/ui_game_end.mp3");
      this.load.audio("ui_countdown", "assets/sounds/ui/ui_countdown.mp3");
      this.load.audio("ui_loadout_equip", "assets/sounds/ui/ui_loadout_equip.mp3");
      this.load.audio("ui_achievement", "assets/sounds/ui/ui_achievement.mp3");
      this.load.audio("ui_unlock", "assets/sounds/ui/ui_unlock.mp3");
      this.load.audio("ui_unlock_item", "assets/sounds/ui/ui_unlock_item.mp3");
      this.load.audio("ui_beep", "assets/sounds/ui/ui_beep.mp3");
      this.load.audio("ui_level_up", "assets/sounds/ui/ui_level_up.mp3");
      this.load.audio("ui_challenge_complete", "assets/sounds/ui/ui_challenge_complete.mp3");
      this.load.audio("ui_window_close", "assets/sounds/ui/ui_window_close.mp3");
      this.load.audio("ui_window_open", "assets/sounds/ui/ui_window_open.mp3");
      this.load.audio("ui_xwilkinx", "assets/sounds/ui/ui_xwilkinx.mp3");
      this.load.audio("wpn_empty", "assets/sounds/weapons/wpn_empty.mp3");
      this.load.audio("wpn_laser", "assets/sounds/weapons/wpn_laser.mp3");
      this.load.audio("wpn_chain", "assets/sounds/weapons/wpn_chain.mp3");
      this.load.audio("wpn_box_in", "assets/sounds/weapons/wpn_box_in.mp3");
      this.load.audio("wpn_box_out", "assets/sounds/weapons/wpn_box_out.mp3");
      this.load.audio("wpn_reload_start", "assets/sounds/weapons/wpn_reload_start.mp3");
      this.load.audio("wpn_reload_end", "assets/sounds/weapons/wpn_reload_end.mp3");
      this.load.audio("wpn_reload_shell_shotgun", "assets/sounds/weapons/wpn_reload_shell_shotgun.mp3");
      this.load.audio("wpn_deploy_firearm_1", "assets/sounds/weapons/wpn_deploy_firearm_1.mp3");
      this.load.audio("wpn_deploy_firearm_2", "assets/sounds/weapons/wpn_deploy_firearm_2.mp3");
      this.load.audio("wpn_deploy_firearm_3", "assets/sounds/weapons/wpn_deploy_firearm_3.mp3");
      this.load.audio("wpn_foley_1", "assets/sounds/weapons/wpn_foley_1.mp3");
      this.load.audio("wpn_foley_2", "assets/sounds/weapons/wpn_foley_2.mp3");
      this.load.audio("wpn_foley_3", "assets/sounds/weapons/wpn_foley_3.mp3");
      this.load.audio("wpn_bolt", "assets/sounds/weapons/wpn_bolt.mp3");
      this.load.audio("wpn_pump", "assets/sounds/weapons/wpn_pump.mp3");
      this.load.audio("wpn_equip", "assets/sounds/weapons/wpn_equip.mp3");
      this.load.audio("explosion_1", "assets/sounds/explosions/explosion_1.mp3");
      this.load.audio("explosion_2", "assets/sounds/explosions/explosion_2.mp3");
      this.load.audio("explosion_3", "assets/sounds/explosions/explosion_3.mp3");
      this.load.audio("explosion_round_1", "assets/sounds/explosions/explosion_round_1.mp3");
      this.load.audio("explosion_round_2", "assets/sounds/explosions/explosion_round_2.mp3");
      this.load.audio("explosion_round_3", "assets/sounds/explosions/explosion_round_3.mp3");
      this.load.audio("physics_grenade_bounce", "assets/sounds/physics/grenade/physics_grenade_bounce.mp3");
      this.load.audio("physics_target_disappear", "assets/sounds/physics/target/physics_target_disappear.mp3");
      this.load.audio("physics_target_hit_1", "assets/sounds/physics/target/physics_target_hit_1.mp3");
      this.load.audio("physics_target_hit_2", "assets/sounds/physics/target/physics_target_hit_2.mp3");
      this.load.audio("physics_target_hit_3", "assets/sounds/physics/target/physics_target_hit_3.mp3");
      this.load.audio("physics_target_hit_4", "assets/sounds/physics/target/physics_target_hit_4.mp3");
      this.load.audio("physics_target_hit_5", "assets/sounds/physics/target/physics_target_hit_5.mp3");
      this.load.audio("physics_target_headshot_hard", "assets/sounds/physics/target/physics_target_headshot_hard.mp3");
      this.load.audio("physics_target_headshot_1", "assets/sounds/physics/target/physics_target_headshot_1.mp3");
      this.load.audio("physics_target_headshot_2", "assets/sounds/physics/target/physics_target_headshot_2.mp3");
      this.load.audio("physics_target_headshot_3", "assets/sounds/physics/target/physics_target_headshot_3.mp3");
      this.load.audio("physics_crate_fall", "assets/sounds/physics/crate/physics_crate_fall.mp3");
      this.load.audio("physics_crate_open_1", "assets/sounds/physics/crate/physics_crate_open_1.mp3");
      this.load.audio("physics_crate_open_2", "assets/sounds/physics/crate/physics_crate_open_2.mp3");
      this.load.audio("physics_body_fall", "assets/sounds/physics/body/physics_body_fall.mp3");
      this.load.audio("physics_body_hit_1", "assets/sounds/physics/body/physics_body_hit_1.mp3");
      this.load.audio("physics_body_hit_2", "assets/sounds/physics/body/physics_body_hit_2.mp3");
      this.load.audio("physics_body_hit_3", "assets/sounds/physics/body/physics_body_hit_3.mp3");
      this.load.audio("physics_body_impact_bullet_1", "assets/sounds/physics/body/physics_body_impact_bullet_1.mp3");
      this.load.audio("physics_body_impact_bullet_2", "assets/sounds/physics/body/physics_body_impact_bullet_2.mp3");
      this.load.audio("physics_body_impact_bullet_3", "assets/sounds/physics/body/physics_body_impact_bullet_3.mp3");
      this.load.audio("physics_bullet_flyby_1", "assets/sounds/physics/bullet/physics_bullet_flyby_1.mp3");
      this.load.audio("physics_bullet_flyby_2", "assets/sounds/physics/bullet/physics_bullet_flyby_2.mp3");
      this.load.audio("physics_bullet_flyby_3", "assets/sounds/physics/bullet/physics_bullet_flyby_3.mp3");
      this.load.audio("physics_bullet_flyby_4", "assets/sounds/physics/bullet/physics_bullet_flyby_4.mp3");
      this.load.audio("physics_bullet_flyby_5", "assets/sounds/physics/bullet/physics_bullet_flyby_5.mp3");
      this.load.audio("physics_shell_generic_1", "assets/sounds/physics/shell/physics_shell_generic_1.mp3");
      this.load.audio("physics_shell_generic_2", "assets/sounds/physics/shell/physics_shell_generic_2.mp3");
      this.load.audio("physics_shell_generic_3", "assets/sounds/physics/shell/physics_shell_generic_3.mp3");
      this.load.audio("physics_shell_shotgun_1", "assets/sounds/physics/shell/physics_shell_shotgun_1.mp3");
      this.load.audio("physics_shell_shotgun_2", "assets/sounds/physics/shell/physics_shell_shotgun_2.mp3");
      this.load.audio("physics_shell_shotgun_3", "assets/sounds/physics/shell/physics_shell_shotgun_3.mp3");
      this.load.audio("physics_concrete_impact_bullet_1", "assets/sounds/physics/concrete/physics_concrete_impact_bullet_1.mp3");
      this.load.audio("physics_concrete_impact_bullet_2", "assets/sounds/physics/concrete/physics_concrete_impact_bullet_2.mp3");
      this.load.audio("physics_concrete_impact_bullet_3", "assets/sounds/physics/concrete/physics_concrete_impact_bullet_3.mp3");
      this.load.script("BlurX", "lib/filters/BlurX.js");
      this.load.script("BlurY", "lib/filters/BlurY.js");
      this.load.script("Gray", "lib/filters/Gray.js");
      this.load.script("Fire", "lib/filters/Fire.js");
    };
    State_Preloader.prototype.loadUpdate = function () {
      this.loadBar.setValue(this.load.progress * 0.01);
    };
    State_Preloader.prototype.create = function () {
      this.bComplete = true;
      this.fileText.setText("Initializing...", true);
      var data = TWP2.GameUtil.game.getPlayerData();
      if (data) {
        console.log("Saved data found");
        try {
          var obj = JSON.parse(data);
          console.log(obj);
          TWP2.PlayerUtil.SetFromData(obj);
          TWP2.GameUtil.game.savePlayerData();
        } catch (e) {
          console.error(e);
          TWP2.PlayerUtil.ResetData();
        }
      } else {
        console.log("No saved data found");
      }
      TWP2.APIUtil.ValidateSession(false);
      if (TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_ARMOR_GAMES) {
        var timer = this.game.time.create();
        timer.add(500, this.showAd, this);
        timer.start();
      } else {
        this.showStartButton();
      }
    };
    State_Preloader.prototype.isComplete = function () {
      return this.bComplete;
    };
    State_Preloader.prototype.showAd = function () {
      if (TWP2.GameUtil.AdsEnabled()) {
        var bResult = TWP2.AdUtil.ShowPreloaderAd();
        console.log(bResult);
        if (!bResult) {
          TWP2.GameUtil.game.onAdClosed();
        }
      }
      var timer = this.game.time.create();
      timer.add(1500, this.showStartButton, this);
      timer.start();
    };
    State_Preloader.prototype.showStartButton = function () {
      var startText = this.game.add.text(0, 0, "Click to start", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      startText.alpha = 0.2;
      startText.x = this.container.width * 0.5 - startText.width * 0.5;
      startText.y = this.container.height + 42;
      this.container.add(startText);
      var tween = this.game.add.tween(startText).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
      this.bg.visible = true;
      this.bg.inputEnabled = true;
      this.bg.events.onInputUp.add(this.onClicked, this);
      this.loadText.setText("Complete", true);
      this.fileText.setText("", true);
      this.spinner.visible = false;
      var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
      checkmark.anchor.set(0.5, 0.5);
      checkmark.x = this.spinner.x;
      checkmark.y = this.spinner.y;
      this.container.add(checkmark);
      var tween = this.game.add.tween(checkmark.scale).from({ x: 2, y: 2 }, 200, Phaser.Easing.Back.Out, true);
      var splash = this.game.add.image(0, 0, "splash_3");
      splash.anchor.set(0.5, 0.5);
      splash.x = this.game.width * 0.5;
      splash.alpha = 0.25;
      this.container.addAt(splash, 0);
      var tween = this.game.add.tween(splash.scale).to({ x: 1.1, y: 1.1 }, 1000, Phaser.Easing.Exponential.Out, true);
      var tween = this.game.add.tween(splash).from({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true);
      TWP2.SoundManager.PlayUISound("ui_unlock_item", 0.5);
    };
    State_Preloader.prototype.onClicked = function () {
      TWP2.SoundManager.PlayUISound("ui_button_click");
      if (TWP2.GameUtil.AdsEnabled() && !TWP2.AdUtil.HasError() && !TWP2.AdUtil.WasCancelled()) {
        var bResult = TWP2.AdUtil.ShowPreloaderAd();
        if (!bResult) {
          this.startGame();
        }
      } else {
        this.startGame();
      }
      if (!TWP2.SoundManager.IsMuted()) {
        this.startGame();
      }
    };
    State_Preloader.prototype.startGame = function () {
      if (this.bStartGame) {
        return;
      }
      this.bStartGame = true;
      if (TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_ARMOR_GAMES) {
        TWP2.AdUtil.OnResumeGame();
      }
      if (TWP2.GameUtil.IsDebugging()) {
        TWP2.GameUtil.game.loadSponsor();
      } else {
        if (TWP2.APIUtil.ShouldShowSponsor()) {
          TWP2.GameUtil.game.loadSponsor();
        } else {
          TWP2.GameUtil.game.loadIntro();
        }
      }
    };
    State_Preloader.prototype.fileUpdate = function (_param1, _param2, _param3) {
      this.fileText.setText(_param3, true);
    };
    return State_Preloader;
  })(Phaser.State);
  TWP2.State_Preloader = State_Preloader;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var State_Sponsor = /** @class */ (function (_super) {
    __extends(State_Sponsor, _super);
    function State_Sponsor() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    State_Sponsor.prototype.create = function () {
      this.bg = this.game.add.sprite(0, 0, "background_shield");
      var tween = this.game.add.tween(this.bg).from({ alpha: 0 }, 2000, Phaser.Easing.Exponential.Out, true);
      var gradient = this.game.add.image(0, 0, "gradient");
      this.shield = this.game.add.image(0, 0, "atlas_ui", "ag_shield");
      this.shield.tint = TWP2.ColourUtil.COLOUR_XP;
      this.shield.anchor.set(0.5, 0.5);
      this.shield.x = this.game.width * 0.5;
      this.shield.y = this.game.height * 0.5 - this.shield.height * 0.4;
      this.text = this.game.add.image(0, 0, "atlas_ui", "ag_text");
      this.text.anchor.set(0.5, 0.5);
      this.text.x = this.game.width * 0.5;
      this.text.y = this.shield.y + this.shield.height * 0.5 + this.text.height * 0.5 + 20;
      var tweenTime = 2500;
      var tween = this.game.add.tween(this.shield).from({ y: this.shield.y - 300, alpha: 0 }, tweenTime, Phaser.Easing.Exponential.InOut, true);
      var tween = this.game.add.tween(this.text).from({ y: this.text.y + 300, alpha: 0 }, tweenTime, Phaser.Easing.Exponential.InOut, true, 500);
      tween.onComplete.add(this.onTweenComplete, this);
      this.bg.inputEnabled = true;
      this.bg.events.onInputUp.add(this.onClicked, this);
      this.soundFx = TWP2.SoundManager.PlayUISound("music_ag", 0.5);
    };
    State_Sponsor.prototype.onTweenComplete = function () {
      var tween = this.game.add.tween(this.shield).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true, 1000);
      var tween = this.game.add.tween(this.text).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true, 1000);
      var tween = this.game.add.tween(this.bg).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true, 1000);
      tween.onComplete.add(this.onClose, this);
    };
    State_Sponsor.prototype.onClose = function () {
      if (this.soundFx) {
        this.soundFx.stop();
      }
      TWP2.GameUtil.game.loadIntro();
    };
    State_Sponsor.prototype.onClicked = function () {
      if (TWP2.GameUtil.IsDebugging()) {
        this.onClose();
      } else {
        TWP2.GameUtil.OpenAGHomepage();
      }
    };
    return State_Sponsor;
  })(Phaser.State);
  TWP2.State_Sponsor = State_Sponsor;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var ButtonBase = /** @class */ (function (_super) {
    __extends(ButtonBase, _super);
    function ButtonBase(_key, _frame) {
      if (_key === void 0) {
        _key = null;
      }
      if (_frame === void 0) {
        _frame = null;
      }
      var _this = _super.call(this, TWP2.GameUtil.game, 0, 0, _key, _frame) || this;
      _this.baseAlpha = 0.6;
      _this.tweenTime = 300;
      _this.bSoundsEnabled = true;
      _this.bEnabled = true;
      _this.bSelected = false;
      _this.bMouseOver = false;
      _this.bAlphaWhenDisabled = true;
      _this.bFullAlphaWhenSelected = false;
      _this.bCanClick = true;
      _this.setBaseAlpha(_this.baseAlpha);
      _this.inputEnabled = true;
      _this.ignoreChildInput = true;
      _this.signalOnUp = _this.events.onInputUp.add(_this.onUp, _this);
      _this.signalOnOver = _this.events.onInputOver.add(_this.onOver, _this);
      _this.signalOnOut = _this.events.onInputOut.add(_this.onOut, _this);
      return _this;
    }
    ButtonBase.prototype.destroy = function () {
      this.visible = false;
      this.bgUp = null;
      this.bgOver = null;
      this.key = null;
      this.buttonData = null;
      this.setEnabled(false);
      this.setTween(null);
      this.signalOnUp.detach();
      this.signalOnOver.detach();
      this.signalOnOut.detach();
      this.signalOnUp = null;
      this.signalOnOver = null;
      this.signalOnOut = null;
      this.inputEnabled = false;
      this.events.destroy();
      this.input.destroy();
      _super.prototype.destroy.call(this);
    };
    ButtonBase.prototype.setFullAlphaWhenSelected = function (_bVal) {
      this.bFullAlphaWhenSelected = _bVal;
    };
    ButtonBase.prototype.setCallback = function (_func, _funcContext, _parameters) {
      if (_parameters === void 0) {
        _parameters = null;
      }
      this.callback = _func;
      this.callbackContext = _funcContext;
      this.parameters = _parameters;
    };
    ButtonBase.prototype.setCallbackParameters = function (_parameters) {
      this.parameters = _parameters;
    };
    ButtonBase.prototype.isSelected = function () {
      return this.bSelected;
    };
    ButtonBase.prototype.isEnabled = function () {
      return this.bEnabled;
    };
    ButtonBase.prototype.setEnabled = function (_bVal) {
      this.onOut();
      this.bEnabled = _bVal;
      this.inputEnabled = this.bEnabled;
      this.signalOnUp.active = this.bEnabled;
      this.signalOnOver.active = this.bEnabled;
      this.signalOnOut.active = this.bEnabled;
      if (this.tween) {
        this.tween.stop();
      }
      this.bMouseOver = false;
      if (!_bVal) {
        if (this.bAlphaWhenDisabled) {
          this.alpha = this.baseAlpha * 0.5;
        } else {
          this.alpha = this.baseAlpha;
        }
      } else {
        this.alpha = this.baseAlpha;
      }
      if (this.bFullAlphaWhenSelected) {
        this.alpha = 0.8;
      }
    };
    ButtonBase.prototype.toggleSelected = function () {
      this.setSelected(!this.bSelected);
    };
    ButtonBase.prototype.setSelected = function (_bVal) {
      this.bSelected = _bVal;
      this.setEnabled(!_bVal);
      if (this.tween) {
        this.tween.stop();
      }
      if (_bVal) {
        if (this.bFullAlphaWhenSelected) {
          this.alpha = 1;
        }
        if (this.bgOver) {
          this.bgOver.visible = true;
          this.bgUp.visible = false;
        }
      } else {
        if (this.bFullAlphaWhenSelected) {
          this.alpha = this.baseAlpha;
        }
        if (this.bgOver) {
          this.bgOver.visible = false;
          this.bgUp.visible = true;
        }
      }
    };
    ButtonBase.prototype.setBaseAlpha = function (_val) {
      if (this.tween) {
        this.tween.stop();
        this.tween = null;
      }
      this.baseAlpha = _val;
      this.alpha = this.baseAlpha;
      //this.onOut();
    };
    ButtonBase.prototype.getBaseAlpha = function () {
      return this.baseAlpha;
    };
    ButtonBase.prototype.onUp = function () {
      if (!this.bEnabled || !this.bCanClick) {
        return;
      }
      if (this.bSoundsEnabled) {
        TWP2.SoundManager.PlayUISound("ui_button_click");
      }
      if (this.callback) {
        this.callback.apply(this.callbackContext, this.parameters);
      }
      this.alpha = this.baseAlpha * 0.5;
      if (this.bMouseOver) {
        this.onOut();
      } else {
        this.onOut();
      }
      this.bMouseOver = false;
      if (this.bSelected && this.bFullAlphaWhenSelected) {
        this.alpha = 1;
      }
    };
    ButtonBase.prototype.onOver = function () {
      if (!this.bEnabled) {
        return;
      }
      if (this.bSoundsEnabled && !this.bMouseOver) {
        TWP2.SoundManager.PlayUISound("ui_button_over");
      }
      this.bMouseOver = true;
      this.setTween(this.game.add.tween(this).to({ alpha: 1 }, this.tweenTime, Phaser.Easing.Exponential.Out, true));
      if (this.bgOver) {
        this.bgOver.visible = true;
        this.bgUp.visible = false;
      }
    };
    ButtonBase.prototype.onOut = function () {
      if (!this.bEnabled) {
        return;
      }
      this.bMouseOver = false;
      this.setTween(this.game.add.tween(this).to({ alpha: this.baseAlpha }, this.tweenTime, Phaser.Easing.Exponential.Out, true));
      if (this.bgOver) {
        this.bgOver.visible = false;
        this.bgUp.visible = true;
      }
    };
    ButtonBase.prototype.setTween = function (_tween) {
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = _tween;
    };
    ButtonBase.prototype.mouseIsOver = function () {
      return this.bMouseOver;
    };
    ButtonBase.prototype.setCanClick = function (_bVal) {
      this.bCanClick = _bVal;
    };
    ButtonBase.prototype.canClick = function () {
      return this.bCanClick;
    };
    ButtonBase.prototype.setButtonData = function (_data) {
      this.buttonData = _data;
    };
    ButtonBase.prototype.getButtonData = function () {
      return this.buttonData;
    };
    return ButtonBase;
  })(Phaser.Sprite);
  TWP2.ButtonBase = ButtonBase;
  var ImageButton = /** @class */ (function (_super) {
    __extends(ImageButton, _super);
    function ImageButton(_id, _frame) {
      if (_frame === void 0) {
        _frame = null;
      }
      return _super.call(this, _id, _frame) || this;
    }
    return ImageButton;
  })(ButtonBase);
  TWP2.ImageButton = ImageButton;
  var TextButton = /** @class */ (function (_super) {
    __extends(TextButton, _super);
    function TextButton(_text, _style) {
      if (_text === void 0) {
        _text = null;
      }
      if (_style === void 0) {
        _style = null;
      }
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 100, 32);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      _this.text = _this.game.add.text(0, 0);
      _this.text.setTextBounds(0, 0, _this.width, _this.height);
      _this.addChild(_this.text);
      if (_text) {
        _this.setText(_text);
      }
      if (_style) {
        _this.setStyle(_style);
      }
      TWP2.GameUtil.SetTextShadow(_this.text);
      return _this;
    }
    TextButton.prototype.destroy = function () {
      this.text = null;
      _super.prototype.destroy.call(this);
    };
    TextButton.prototype.onOver = function () {
      _super.prototype.onOver.call(this);
      if (this.text) {
        //this.text.addColor(ColourUtil.COLOUR_THEME_STRING, 0);
        //var tween = this.game.add.tween(this.text).to({ x: 12 }, 500, Phaser.Easing.Exponential.Out, true);
      }
    };
    TextButton.prototype.onOut = function () {
      _super.prototype.onOut.call(this);
      if (this.text) {
        //this.text.addColor("#FFFFFF", 0);
        //var tween = this.game.add.tween(this.text).to({ x: 0 }, 500, Phaser.Easing.Exponential.Out, true);
      }
    };
    TextButton.prototype.setText = function (_val) {
      this.text.setText(_val, true);
    };
    TextButton.prototype.setStyle = function (_style) {
      this.text.setStyle(_style);
      //GameUtil.SetTextShadow(this.text);
    };
    return TextButton;
  })(ButtonBase);
  TWP2.TextButton = TextButton;
  var SplashButton = /** @class */ (function (_super) {
    __extends(SplashButton, _super);
    function SplashButton(_colour) {
      if (_colour === void 0) {
        _colour = TWP2.ColourUtil.COLOUR_BUTTONS;
      }
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 190, 320);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, _colour, 0.8);
      gfx.beginFill(_colour, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.statusIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_new");
      _this.statusIcon.anchor.set(0.5, 0.5);
      _this.statusIcon.x = _this.width * 0.5;
      _this.statusIcon.y = _this.height * 0.8;
      _this.statusIcon.visible = false;
      _this.addChild(_this.statusIcon);
      _this.onOut();
      _this.labelText = _this.game.add.text(0, 0, "", { font: "20px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 2, _this.width, 20);
      _this.labelText.y = _this.height * 0.5 + 20;
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.addChild(_this.labelText);
      return _this;
    }
    SplashButton.prototype.setIcon = function (_atlas, _id, _colour) {
      if (_colour === void 0) {
        _colour = 0xffffff;
      }
      this.icon = this.game.add.image(0, 0, _atlas, _id);
      this.icon.tint = _colour;
      this.icon.anchor.set(0.5, 0.5);
      this.icon.x = this.width * 0.5;
      this.icon.y = this.height * 0.5 - 20;
      this.addChildAt(this.icon, 1);
    };
    SplashButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    SplashButton.prototype.setNewIconVisible = function () {
      this.statusIcon.visible = true;
      this.statusIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      this.statusIcon.frameName = "icon_new";
    };
    SplashButton.prototype.setAlertIconVisible = function () {
      this.statusIcon.visible = true;
      this.statusIcon.tint = TWP2.ColourUtil.COLOUR_XP;
      this.statusIcon.frameName = "icon_alert";
    };
    SplashButton.prototype.clearStatusIcon = function () {
      this.statusIcon.visible = false;
    };
    return SplashButton;
  })(ButtonBase);
  TWP2.SplashButton = SplashButton;
  var AchievementButton = /** @class */ (function (_super) {
    __extends(AchievementButton, _super);
    function AchievementButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 120, 120);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.statusIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_lock");
      _this.statusIcon.anchor.set(0.5, 0.5);
      _this.statusIcon.x = _this.width * 0.5;
      _this.statusIcon.y = _this.height - _this.statusIcon.height * 0.5 - 4;
      _this.addChild(_this.statusIcon);
      _this.onOut();
      _this.setCanClick(false);
      _this.labelText = _this.game.add.text(0, 4, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "top" });
      _this.labelText.setTextBounds(0, 2, _this.width, 20);
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.addChild(_this.labelText);
      return _this;
    }
    AchievementButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    AchievementButton.prototype.setAchievement = function (_data) {
      this.setLabelText(_data["name"]);
      var icon = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
      icon.anchor.set(0.5, 0.5);
      icon.x = this.width * 0.5;
      icon.y = this.height * 0.5;
      this.addChild(icon);
    };
    AchievementButton.prototype.setUnlocked = function (_bVal) {
      this.setBaseAlpha(_bVal ? 0.5 : 0.2);
      if (_bVal) {
        this.statusIcon.frameName = "icon_checkmark";
        this.statusIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      } else {
        this.statusIcon.frameName = "icon_lock";
        this.statusIcon.tint = 0xffffff;
      }
    };
    return AchievementButton;
  })(ButtonBase);
  TWP2.AchievementButton = AchievementButton;
  var BasicButton = /** @class */ (function (_super) {
    __extends(BasicButton, _super);
    function BasicButton(_iconId) {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 50, 50);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      var icon = _this.game.add.image(0, 0, "atlas_ui", _iconId);
      icon.anchor.set(0.5, 0.5);
      icon.x = _this.width * 0.5;
      icon.y = _this.height * 0.5;
      _this.addChild(icon);
      _this.onOut();
      return _this;
    }
    return BasicButton;
  })(ButtonBase);
  TWP2.BasicButton = BasicButton;
  var TabButton = /** @class */ (function (_super) {
    __extends(TabButton, _super);
    function TabButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 190, 50);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.labelText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 2, _this.width, _this.height);
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.addChild(_this.labelText);
      _this.newIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_new");
      _this.newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      _this.newIcon.x = _this.width - _this.newIcon.width - 4;
      _this.newIcon.y = 4;
      _this.addChild(_this.newIcon);
      _this.newIcon.visible = false;
      _this.bFullAlphaWhenSelected = true;
      _this.onOut();
      return _this;
    }
    TabButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    TabButton.prototype.setNewIconVisible = function (_bVal) {
      this.newIcon.visible = _bVal;
    };
    TabButton.prototype.setIcon = function (_id, _frame) {
      var icon = this.game.add.image(0, 0, _id, _frame);
      this.addChild(icon);
      icon.x = 10;
      icon.y = this.height * 0.5 - icon.height * 0.5;
    };
    return TabButton;
  })(ButtonBase);
  TWP2.TabButton = TabButton;
  var LoadoutButton = /** @class */ (function (_super) {
    __extends(LoadoutButton, _super);
    function LoadoutButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 42, 42);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.onOut();
      _this.labelText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.labelText.setTextBounds(0, 2, _this.width, _this.height);
      _this.addChild(_this.labelText);
      _this.bFullAlphaWhenSelected = true;
      return _this;
    }
    LoadoutButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    LoadoutButton.prototype.setPlusVisible = function (_bVal) {
      if (_bVal) {
        var icon = this.game.add.image(0, 0, "atlas_ui", "icon_plus");
        icon.anchor.set(0.5, 0.5);
        icon.x = this.width * 0.5;
        icon.y = this.height * 0.5;
        this.addChild(icon);
      }
    };
    return LoadoutButton;
  })(ButtonBase);
  TWP2.LoadoutButton = LoadoutButton;
  var WeaponCategoryButton = /** @class */ (function (_super) {
    __extends(WeaponCategoryButton, _super);
    function WeaponCategoryButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 40, 40);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      _this.newIcon = _this.game.add.graphics();
      _this.newIcon.lineStyle(2, TWP2.ColourUtil.COLOUR_GREEN, 1);
      _this.newIcon.drawCircle(0, 0, 16);
      _this.newIcon.x = _this.width * 0.5;
      _this.newIcon.y = _this.width * 0.5;
      _this.addChild(_this.newIcon);
      _this.circle = _this.game.add.graphics();
      _this.circle.beginFill(0xffffff, 1);
      _this.circle.drawCircle(0, 0, 8);
      _this.circle.x = _this.width * 0.5;
      _this.circle.y = _this.height * 0.5;
      _this.addChild(_this.circle);
      _this.bFullAlphaWhenSelected = true;
      _this.setBaseAlpha(0.2);
      return _this;
    }
    WeaponCategoryButton.prototype.destroy = function () {
      this.circle = null;
      this.newIcon = null;
      _super.prototype.destroy.call(this);
    };
    WeaponCategoryButton.prototype.setNewIconVisible = function (_bVal) {
      this.newIcon.visible = _bVal;
    };
    return WeaponCategoryButton;
  })(ButtonBase);
  TWP2.WeaponCategoryButton = WeaponCategoryButton;
  var WeaponButton = /** @class */ (function (_super) {
    __extends(WeaponButton, _super);
    function WeaponButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, 500, 234, TWP2.GameUtil.RECT_RADIUS);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.numberText = _this.game.add.text(4, 4, "", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.numberText.alpha = 0.2;
      _this.addChild(_this.numberText);
      var container = _this.game.add.group();
      _this.nameText = _this.game.add.text(0, 0, "Name", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(_this.nameText);
      container.add(_this.nameText);
      _this.typeText = _this.game.add.text(0, 0, "Type", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.typeText.y = _this.nameText.height - 4;
      _this.typeText.alpha = 0.8;
      container.add(_this.typeText);
      _this.addChild(container);
      container.x = 4;
      container.y = _this.height - container.height;
      _this.bFullAlphaWhenSelected = true;
      _this.onOut();
      return _this;
    }
    WeaponButton.prototype.destroy = function () {
      this.nameText = null;
      this.typeText = null;
      this.icon = null;
      _super.prototype.destroy.call(this);
    };
    WeaponButton.prototype.setSelected = function (_bVal) {
      _super.prototype.setSelected.call(this, _bVal);
      if (this.icon) {
        this.icon.alpha = this.bSelected ? 1 : 0.5;
      }
    };
    WeaponButton.prototype.setPrimary = function (_bVal) {
      this.bPrimary = _bVal;
      this.setNumberText(_bVal ? "Primary" : "Secondary");
    };
    WeaponButton.prototype.isPrimary = function () {
      return this.bPrimary;
    };
    WeaponButton.prototype.setNumberText = function (_val) {
      this.numberText.setText(_val, true);
    };
    WeaponButton.prototype.setNewIconVisible = function (_bVal) {
      if (_bVal) {
        if (!this.newIcon) {
          this.newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
          this.newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
          this.newIcon.x = this.width - this.newIcon.width;
          this.newIcon.y = 2;
          this.addChild(this.newIcon);
        }
        this.newIcon.visible = true;
      } else {
        if (this.newIcon) {
          this.newIcon.visible = false;
        }
      }
    };
    WeaponButton.prototype.setWeapon = function (_data, _mods) {
      if (_mods === void 0) {
        _mods = null;
      }
      this.setButtonData(_data);
      if (_data) {
        this.nameText.setText(_data["name"], true);
        this.typeText.setText(TWP2.WeaponDatabase.GetTypeString(_data["type"]), true);
        /*
              if (this.icon)
              {
                  this.icon.frameName = _data["id"];
              }
              else
              {
                  this.icon = this.game.add.image(0, 0, "atlas_weapons_icons", _data["id"]);
                  this.addChild(this.icon);
              }
              */
        if (this.icon) {
          this.icon.destroy();
        }
        if (_mods) {
          TWP2.WeaponDatabase.ApplyWeaponMods(_data, _mods);
        }
        var group = TWP2.GameUtil.CreateWeapon(_data);
        this.icon = this.game.add.image(0, 0, group.generateTexture());
        this.icon.anchor.set(0.5, 0.5);
        group.destroy();
        this.addChild(this.icon);
        this.icon.width = Math.min(this.width - 8, this.icon.width);
        this.icon.scale.y = this.icon.scale.x;
        this.icon.x = this.width * 0.5;
        this.icon.y = this.height * 0.5;
        -20;
        //var tween = this.game.add.tween(this.icon.scale).from({ x: 0.25, y: 0.25 }, 300, Phaser.Easing.Exponential.Out, true);
        var bPendingItems = TWP2.PlayerUtil.HasPendingItemsForWeaponCategories(this.bPrimary ? TWP2.WeaponDatabase.GetPrimaryWeaponTypes() : TWP2.WeaponDatabase.GetSecondaryWeaponTypes());
        if (!bPendingItems) {
          bPendingItems = TWP2.PlayerUtil.HasPendingModsForWeapon(_data["id"]);
        }
        this.setNewIconVisible(bPendingItems);
      }
    };
    return WeaponButton;
  })(ButtonBase);
  TWP2.WeaponButton = WeaponButton;
  var MenuButton = /** @class */ (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(_width, _boundsAlignH, _colour, _height, _fontSize) {
      if (_width === void 0) {
        _width = 220;
      }
      if (_boundsAlignH === void 0) {
        _boundsAlignH = "center";
      }
      if (_colour === void 0) {
        _colour = TWP2.ColourUtil.COLOUR_BUTTONS;
      }
      if (_height === void 0) {
        _height = 40;
      }
      if (_fontSize === void 0) {
        _fontSize = 14;
      }
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, _width, _height);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, _colour, 0.8);
      gfx.beginFill(_colour, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      var padding = 8;
      _this.labelText = _this.game.add.text(padding, 0, "", { font: _fontSize + "px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: _boundsAlignH, boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 3, _this.width - padding * 2, _this.height);
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.addChild(_this.labelText);
      _this.onOut();
      return _this;
    }
    MenuButton.prototype.destroy = function () {
      this.icon = null;
      this.labelText = null;
      _super.prototype.destroy.call(this);
    };
    MenuButton.prototype.setTint = function (_val) {
      this.bgUp.tint = _val;
    };
    MenuButton.prototype.setDefaultLabelStyle = function () {
      this.setLabelStyle({ font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
    };
    MenuButton.prototype.setLabelText = function (_val, _bSetDefaultLabelStyle) {
      if (_bSetDefaultLabelStyle === void 0) {
        _bSetDefaultLabelStyle = false;
      }
      if (_bSetDefaultLabelStyle) {
        this.setDefaultLabelStyle();
      }
      this.labelText.setText(_val, true);
    };
    MenuButton.prototype.setLabelStyle = function (_style) {
      this.labelText.setStyle(_style, true);
    };
    MenuButton.prototype.setCost = function (_val) {
      this.setLabelStyle({ font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      this.setLabelText("$" + TWP2.GameUtil.FormatNum(_val));
    };
    MenuButton.prototype.setToggle = function (_bVal) {
      this.bToggle = _bVal;
    };
    MenuButton.prototype.setSelected = function (_bVal) {
      if (this.bToggle) {
        this.bSelected = _bVal;
        if (this.bSelected) {
          var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
          checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
          this.setIcon(checkmark);
        } else {
          var xIcon = this.game.add.image(0, 0, "atlas_ui", "icon_x");
          xIcon.tint = TWP2.ColourUtil.COLOUR_RED;
          this.setIcon(xIcon);
        }
      } else {
        _super.prototype.setSelected.call(this, _bVal);
      }
    };
    MenuButton.prototype.getIcon = function () {
      return this.icon;
    };
    MenuButton.prototype.setIcon = function (_icon, _align) {
      if (_align === void 0) {
        _align = "right";
      }
      if (this.icon) {
        this.icon.destroy();
        this.icon = null;
      }
      if (_icon) {
        var padding = 8;
        this.icon = _icon;
        if (this.icon.height > this.height) {
          this.icon.height = this.height - padding * 1.5;
          this.icon.scale.x = this.icon.scale.y;
        }
        this.icon.y = this.height * 0.5 - this.icon.height * 0.5;
        if (_align == "left") {
          this.icon.x = padding;
        } else if (_align == "center") {
          this.icon.x = this.width * 0.5 - this.icon.width * 0.5;
        } else if (_align == "right") {
          this.icon.x = this.width - this.icon.width - padding;
        } else if (_align == "right_top") {
          this.icon.x = this.width - this.icon.width - 2;
          this.icon.y = 2;
        }
        this.addChild(this.icon);
      }
    };
    return MenuButton;
  })(ButtonBase);
  TWP2.MenuButton = MenuButton;
  var WeaponListButton = /** @class */ (function (_super) {
    __extends(WeaponListButton, _super);
    function WeaponListButton(_width) {
      if (_width === void 0) {
        _width = 240;
      }
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, _width, 52);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.onOut();
      var padding = 8;
      _this.labelText = _this.game.add.text(padding, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 2, _this.width, _this.height);
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.addChild(_this.labelText);
      _this.statusIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_lock");
      _this.statusIcon.anchor.set(0.5, 0.5);
      _this.statusIcon.x = _this.width - _this.statusIcon.width * 0.5 - 8;
      _this.statusIcon.y = _this.height * 0.5;
      _this.statusIcon.alpha = 0.5;
      _this.addChild(_this.statusIcon);
      _this.statusIcon.visible = false;
      _this.bFullAlphaWhenSelected = true;
      return _this;
    }
    WeaponListButton.prototype.destroy = function () {
      this.weaponIcon = null;
      this.labelText = null;
      _super.prototype.destroy.call(this);
    };
    WeaponListButton.prototype.setNewIconVisible = function (_bVal) {
      if (_bVal) {
        if (!this.newIcon) {
          this.newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
          this.newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
          this.newIcon.x = 80;
          this.newIcon.y = this.height * 0.5 - this.newIcon.height * 0.5;
          this.addChild(this.newIcon);
        }
      }
      if (this.newIcon) {
        this.newIcon.visible = _bVal;
      }
    };
    WeaponListButton.prototype.setWeapon = function (_data) {
      if (_data) {
        this.setLabelText(_data["name"]);
        this.weaponIcon = this.game.add.image(0, 0, "atlas_weapons_icons_small", _data["id"]);
        this.weaponIcon.anchor.set(0.5, 0.5);
        this.weaponIcon.x = this.width * 0.5 + 30;
        this.weaponIcon.y = this.height * 0.5;
        this.addChild(this.weaponIcon);
        if (TWP2.PlayerUtil.HasInventoryWeapon(_data["id"])) {
          //...
        } else if (_data["unlockLevel"] > TWP2.PlayerUtil.player["level"]) {
          this.statusIcon.visible = true;
          this.statusIcon.frameName = "icon_lock";
          this.setBaseAlpha(0.2);
        } else {
          this.statusIcon.visible = true;
          this.statusIcon.frameName = "icon_buy";
        }
      }
    };
    WeaponListButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    WeaponListButton.prototype.setSelected = function (_bVal) {
      _super.prototype.setSelected.call(this, _bVal);
      if (_bVal) {
        this.setNewIconVisible(false);
      }
    };
    WeaponListButton.prototype.setCurrent = function (_bVal) {
      if (_bVal) {
        if (!this.checkmark) {
          this.checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
          this.checkmark.x = this.width - this.checkmark.width - 10;
          this.checkmark.y = this.height * 0.5 - this.checkmark.height * 0.5;
          this.addChild(this.checkmark);
        }
      }
      if (this.checkmark) {
        this.checkmark.visible = _bVal;
      }
    };
    return WeaponListButton;
  })(ButtonBase);
  TWP2.WeaponListButton = WeaponListButton;
  var ModSelectButton = /** @class */ (function (_super) {
    __extends(ModSelectButton, _super);
    function ModSelectButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 91, 168);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      var textContainer = _this.game.add.group();
      _this.addChild(textContainer);
      _this.modText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      TWP2.GameUtil.SetTextShadow(_this.modText);
      _this.modText.setTextBounds(0, 0, _this.width, 32);
      _this.modText.y = 10;
      textContainer.add(_this.modText);
      _this.labelText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 0, _this.width, 24);
      _this.labelText.alpha = 0.2;
      _this.labelText.y = _this.height - _this.labelText.textBounds.height;
      textContainer.add(_this.labelText);
      _this.modImage = _this.game.add.image(0, 0, "atlas_ui", TWP2.WeaponDatabase.OPTIC_REFLEX_1);
      _this.modImage.anchor.set(0.5, 0.5);
      _this.modImage.x = _this.width * 0.5;
      _this.modImage.y = _this.height * 0.5;
      _this.addChild(_this.modImage);
      _this.newIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_new");
      _this.newIcon.x = _this.width * 0.5;
      _this.newIcon.y = _this.height * 0.5 + _this.newIcon.height * 0.5 + 24;
      _this.newIcon.anchor.set(0.5, 0.5);
      _this.newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      _this.addChild(_this.newIcon);
      _this.setNewIconVisible(false);
      _this.onOut();
      return _this;
    }
    ModSelectButton.prototype.destroy = function () {
      this.labelText = null;
      this.modText = null;
      this.modImage = null;
      _super.prototype.destroy.call(this);
    };
    ModSelectButton.prototype.setNewIconVisible = function (_bVal) {
      this.newIcon.visible = _bVal;
    };
    ModSelectButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    ModSelectButton.prototype.setModText = function (_val) {
      this.modText.setText(_val, true);
    };
    ModSelectButton.prototype.setMod = function (_data) {
      var bDefaultMod = _data ? TWP2.WeaponDatabase.IsDefaultMod(_data["id"]) : true;
      this.setButtonData(_data);
      this.setModText(bDefaultMod ? "None" : _data["name"]);
      this.modText.alpha = bDefaultMod ? 0.2 : 1;
      if (!bDefaultMod) {
        this.modImage.frameName = _data["id"];
        this.modImage.alpha = 1;
        this.modText.addColor(TWP2.ColourUtil.COLOUR_XP_STRING, 0);
      } else {
        this.modImage.frameName = "icon_close";
        this.modImage.alpha = 0.1;
        this.modText.addColor("#FFFFFF", 0);
      }
    };
    return ModSelectButton;
  })(ButtonBase);
  TWP2.ModSelectButton = ModSelectButton;
  var LaserSelectButton = /** @class */ (function (_super) {
    __extends(LaserSelectButton, _super);
    function LaserSelectButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 92.9, 24);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRect(0, 0, _this.width, _this.height);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRect(0, 0, _this.width, _this.height);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      var textContainer = _this.game.add.group();
      _this.addChild(textContainer);
      _this.onOut();
      return _this;
    }
    LaserSelectButton.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    return LaserSelectButton;
  })(ButtonBase);
  TWP2.LaserSelectButton = LaserSelectButton;
  var ModButton = /** @class */ (function (_super) {
    __extends(ModButton, _super);
    function ModButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 160, 140);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.unlockBar = new TWP2.UIBar({
        w: _this.width - 10,
        h: 2,
        value: 0,
        blocks: 5,
      });
      _this.unlockBar.x = _this.width * 0.5 - _this.unlockBar.width * 0.5;
      _this.unlockBar.y = 5;
      _this.addChild(_this.unlockBar);
      _this.unlockBar.visible = false;
      _this.labelText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "top", align: "center" });
      _this.labelText.setTextBounds(0, 0, _this.width, 20);
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.labelText.y = _this.height * 0.5 + 4;
      _this.addChild(_this.labelText);
      _this.modIcon = _this.game.add.image(0, 0, "atlas_ui", TWP2.WeaponDatabase.OPTIC_REFLEX_1);
      _this.modIcon.anchor.set(0.5, 0.5);
      _this.modIcon.x = _this.width * 0.5;
      _this.modIcon.y = _this.labelText.y - 28;
      _this.addChild(_this.modIcon);
      _this.newIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_new");
      _this.newIcon.x = _this.width - _this.newIcon.width - 2;
      _this.newIcon.y = _this.height - _this.newIcon.height - 2;
      _this.newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      _this.addChild(_this.newIcon);
      _this.lockIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_lock");
      _this.lockIcon.x = _this.width * 0.5 - _this.lockIcon.width * 0.5;
      _this.lockIcon.y = _this.height - _this.lockIcon.height - 2;
      _this.addChild(_this.lockIcon);
      _this.lockIcon.visible = false;
      _this.costText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING, boundsAlignH: "center", boundsAlignV: "middle", align: "center" });
      _this.costText.setTextBounds(0, 0, _this.width, _this.lockIcon.height);
      _this.costText.y = _this.lockIcon.y;
      _this.addChild(_this.costText);
      _this.box = _this.game.add.graphics();
      _this.box.beginFill(0xffffff, 0.08);
      _this.box.drawRect(0, 0, 24, 24);
      _this.addChild(_this.box);
      _this.box.visible = false;
      _this.checkmark = _this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      _this.checkmark.x = _this.width * 0.5 - _this.checkmark.width * 0.5;
      _this.checkmark.y = _this.height - _this.checkmark.height - 2;
      _this.checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
      _this.addChild(_this.checkmark);
      _this.box.x = _this.checkmark.x;
      _this.box.y = _this.checkmark.y;
      _this.onOut();
      return _this;
    }
    ModButton.prototype.destroy = function () {
      this.modData = null;
      _super.prototype.destroy.call(this);
    };
    ModButton.prototype.setUnlockBarValue = function (_val) {
      this.unlockBar.visible = true;
      this.unlockBar.setValue(_val);
      if (_val >= 1) {
        this.unlockBar.setTint(TWP2.ColourUtil.COLOUR_GREEN);
      }
    };
    ModButton.prototype.setUnlockBarVisible = function (_bVal) {
      this.unlockBar.visible = _bVal;
    };
    ModButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    ModButton.prototype.setNewIconVisible = function (_bVal) {
      this.newIcon.visible = _bVal;
    };
    ModButton.prototype.setMod = function (_data) {
      this.modData = _data;
      this.setLabelText(_data["name"]);
      var bDefaultMod = TWP2.WeaponDatabase.IsDefaultMod(_data["id"]);
      if (!bDefaultMod) {
        this.modIcon.frameName = _data["id"];
      } else {
        this.modIcon.frameName = "icon_close";
        this.labelText.addColor("#FFFFFF", 0);
      }
      this.modIcon.alpha = bDefaultMod ? 0.2 : 1;
      //this.modIcon.visible = !WeaponDatabase.IsDefaultMod(_data["id"]);
      this.costText.setText("$" + TWP2.GameUtil.FormatNum(_data["cost"]), true);
    };
    ModButton.prototype.setOwned = function (_bVal) {
      this.bOwned = _bVal;
      if (this.bOwned) {
        this.costText.visible = false;
        this.box.visible = true;
      } else {
        if (this.bCurrent) {
          this.costText.visible = false;
        }
        this.setBaseAlpha(0.3);
        this.box.visible = false;
      }
    };
    ModButton.prototype.setLocked = function (_bVal) {
      this.setCanClick(!_bVal);
      this.lockIcon.visible = _bVal;
      if (_bVal) {
        this.setBaseAlpha(0.15);
      }
      if (!this.bOwned) {
        this.costText.visible = !_bVal;
      } else {
        this.costText.visible = false;
      }
    };
    ModButton.prototype.isOwned = function () {
      return this.bOwned;
    };
    ModButton.prototype.setCurrent = function (_bVal) {
      this.bCurrent = _bVal;
      this.checkmark.visible = _bVal;
    };
    return ModButton;
  })(ButtonBase);
  TWP2.ModButton = ModButton;
  var AddButton = /** @class */ (function (_super) {
    __extends(AddButton, _super);
    function AddButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 40, 102);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_GREEN, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_GREEN, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      var icon = _this.game.add.image(0, 0, "atlas_ui", "icon_plus");
      icon.anchor.set(0.5, 0.5);
      icon.x = _this.width * 0.5;
      icon.y = _this.height * 0.5;
      _this.addChild(icon);
      _this.onOut();
      return _this;
    }
    AddButton.prototype.setEnabled = function (_bVal) {
      _super.prototype.setEnabled.call(this, _bVal);
      if (!_bVal) {
        this.setBaseAlpha(0.2);
      }
    };
    return AddButton;
  })(ButtonBase);
  TWP2.AddButton = AddButton;
  var GameModeButton = /** @class */ (function (_super) {
    __extends(GameModeButton, _super);
    function GameModeButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 260, 129);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.onOut();
      _this.labelText = _this.game.add.text(0, 0, "", { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 0, 120, 20);
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.labelText.x = _this.width * 0.5 - 20;
      _this.labelText.y = _this.height * 0.5 - _this.labelText.height * 0.5;
      _this.addChild(_this.labelText);
      _this.starContainer = new TWP2.StarContainer("icon_star_small");
      _this.starContainer.x = _this.labelText.x + _this.labelText.textBounds.width * 0.5 - _this.starContainer.width * 0.5;
      _this.starContainer.y = _this.labelText.y + _this.labelText.height + 2;
      _this.addChild(_this.starContainer);
      _this.bFullAlphaWhenSelected = true;
      return _this;
    }
    GameModeButton.prototype.destroy = function () {
      this.labelText = null;
      this.icon = null;
      _super.prototype.destroy.call(this);
    };
    GameModeButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    GameModeButton.prototype.setGameMode = function (_data) {
      this.setButtonData(_data);
      this.setLabelText(_data["name"]);
      if (this.icon) {
        this.icon.destroy();
      }
      this.icon = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
      this.icon.x = 10;
      this.icon.y = this.height * 0.5 - this.icon.height * 0.5;
      this.addChild(this.icon);
      if (this.starContainer) {
        this.starContainer.setStars(TWP2.GameModeDatabase.GetStarsForGameMode(_data["id"], TWP2.PlayerUtil.player.bestScores[_data["id"]]));
      }
    };
    return GameModeButton;
  })(ButtonBase);
  TWP2.GameModeButton = GameModeButton;
  var SelectLoadoutButton = /** @class */ (function (_super) {
    __extends(SelectLoadoutButton, _super);
    function SelectLoadoutButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 190, 330);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.onOut();
      _this.bAlphaWhenDisabled = false;
      return _this;
    }
    SelectLoadoutButton.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    SelectLoadoutButton.prototype.showCheckmark = function () {
      var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
      checkmark.anchor.set(0.5, 0.5);
      checkmark.x = this.width * 0.5;
      checkmark.y = this.height * 0.5;
      this.addChild(checkmark);
      var tween = this.game.add.tween(checkmark.scale).from({ x: 2, y: 2 }, 300, Phaser.Easing.Exponential.Out, true);
    };
    SelectLoadoutButton.prototype.setLoadout = function (_data) {
      if (_data) {
        //_data["id"] + 1
        var titleText = this.game.add.text(0, 0, _data["name"], { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        titleText.alpha = 0.2;
        titleText.x = this.width * 0.5 - titleText.width * 0.5;
        titleText.y = 10;
        this.addChild(titleText);
        /* Primary */
        var primaryData = TWP2.WeaponDatabase.GetWeapon(_data["primary"]["id"]);
        var primaryText = this.game.add.text(0, 0, primaryData["name"], { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        primaryText.x = this.width * 0.5 - primaryText.width * 0.5;
        primaryText.y = 60;
        this.addChild(primaryText);
        var primaryModContainer = this.createModGroup(_data["primary"]["mods"]);
        primaryModContainer.x = this.width * 0.5 - primaryModContainer.width * 0.5;
        primaryModContainer.y = primaryText.y + primaryText.height + 50;
        this.addChild(primaryModContainer);
        var primary = this.game.add.image(0, 0, "atlas_weapons_icons_small", _data["primary"]["id"]);
        primary.anchor.set(0.5, 0.5);
        primary.x = this.width * 0.5;
        primary.y = (primaryText.y + primaryText.height + primaryModContainer.y) * 0.5;
        this.addChild(primary);
        /* Secondary */
        var secondaryData = TWP2.WeaponDatabase.GetWeapon(_data["secondary"]["id"]);
        var secondaryText = this.game.add.text(0, 0, secondaryData["name"], { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        secondaryText.x = this.width * 0.5 - secondaryText.width * 0.5;
        secondaryText.y = primary.y + 100;
        this.addChild(secondaryText);
        var secondaryModContainer = this.createModGroup(_data["secondary"]["mods"]);
        secondaryModContainer.x = this.width * 0.5 - secondaryModContainer.width * 0.5;
        secondaryModContainer.y = secondaryText.y + secondaryText.height + 50;
        this.addChild(secondaryModContainer);
        var secondary = this.game.add.image(0, 0, "atlas_weapons_icons_small", _data["secondary"]["id"]);
        secondary.anchor.set(0.5, 0.5);
        secondary.x = this.width * 0.5;
        secondary.y = (secondaryText.y + secondaryText.height + secondaryModContainer.y) * 0.5;
        this.addChild(secondary);
      }
    };
    SelectLoadoutButton.prototype.createModGroup = function (_mods) {
      var modPadding = 6;
      var modScale = 0.7;
      var desiredHeight = 30;
      var modContainer = this.game.add.group();
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.1);
      gfx.drawRect(0, 0, this.width - 8, desiredHeight);
      modContainer.add(gfx);
      var itemContainer = this.game.add.group();
      var primaryMods = _mods;
      var i = 0;
      for (var id in primaryMods) {
        if (!TWP2.WeaponDatabase.IsDefaultMod(primaryMods[id])) {
          var curMod = this.game.add.image(0, 0, "atlas_ui", primaryMods[id]);
          curMod.scale.set(modScale, modScale);
          curMod.x = itemContainer.width + (i > 0 ? modPadding : 0);
          curMod.y = desiredHeight * 0.5 - curMod.height * 0.5;
          itemContainer.add(curMod);
          i++;
        }
      }
      if (i == 0) {
        var noText = this.game.add.text(0, 0, "No mods", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        noText.alpha = 0.2;
        noText.y = desiredHeight * 0.5 - noText.height * 0.5 + 2;
        itemContainer.add(noText);
      }
      itemContainer.x = modContainer.width * 0.5 - itemContainer.width * 0.5;
      modContainer.add(itemContainer);
      return modContainer;
    };
    return SelectLoadoutButton;
  })(ButtonBase);
  TWP2.SelectLoadoutButton = SelectLoadoutButton;
  var ClassItemButton = /** @class */ (function (_super) {
    __extends(ClassItemButton, _super);
    function ClassItemButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 340, ClassItemButton.BUTTON_HEIGHT);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      var padding = 8;
      _this.labelText = _this.game.add.text(padding, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
      _this.labelText.alpha = 0.5;
      _this.labelText.setTextBounds(0, 0, _this.width - padding * 2, 24);
      _this.labelText.y = _this.height * 0.5 - _this.labelText.height;
      _this.addChild(_this.labelText);
      _this.itemText = _this.game.add.text(padding, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
      _this.itemText.setTextBounds(0, 0, _this.width - padding * 2, 24);
      _this.itemText.y = _this.height * 0.5;
      _this.addChild(_this.itemText);
      TWP2.GameUtil.SetTextShadow(_this.itemText);
      _this.onOut();
      return _this;
    }
    ClassItemButton.prototype.destroy = function () {
      this.newIcon = null;
      this.checkmarkIcon = null;
      this.labelText = null;
      this.itemText = null;
      _super.prototype.destroy.call(this);
    };
    ClassItemButton.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    ClassItemButton.prototype.setLocked = function (_bVal, _str) {
      if (_str === void 0) {
        _str = null;
      }
      this.setEnabled(!_bVal);
      if (_bVal) {
        var lockIcon = this.game.add.image(0, 0, "atlas_ui", "icon_lock");
        lockIcon.x = this.width - lockIcon.width - 10;
        lockIcon.y = this.height * 0.5 - lockIcon.height * 0.5;
        this.addChild(lockIcon);
        if (_str) {
          this.itemText.setText(_str, true);
        }
      }
    };
    ClassItemButton.prototype.setAsCurrent = function () {
      this.checkmarkIcon = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      this.checkmarkIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      this.checkmarkIcon.x = this.width - this.checkmarkIcon.width - 8;
      this.checkmarkIcon.y = this.height * 0.5 - this.checkmarkIcon.height * 0.5;
      this.addChild(this.checkmarkIcon);
    };
    ClassItemButton.prototype.showNewIcon = function () {
      if (!this.newIcon) {
        this.newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
        this.newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
        this.newIcon.x = this.width - this.newIcon.width - 8;
        this.newIcon.y = this.height * 0.5 - this.newIcon.height * 0.5;
        this.addChild(this.newIcon);
      }
    };
    ClassItemButton.prototype.hideNewIcon = function () {
      if (this.newIcon) {
        this.newIcon.destroy();
      }
      this.newIcon = null;
    };
    ClassItemButton.prototype.setWeapon = function (_data) {
      var weaponData = TWP2.WeaponDatabase.GetWeapon(_data["id"]);
      this.itemText.setText(weaponData["name"], true);
      var container = this.game.add.group();
      this.addChild(container);
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, this.width * 0.5, 50);
      container.add(gfx);
      var weapon = this.game.add.image(0, 0, "atlas_weapons_icons_small", _data["id"]);
      //var weapon = GameUtil.CreateWeapon(_data);
      //weapon.scale.set(0.25, 0.25);
      weapon.anchor.set(0.5, 0.5);
      weapon.x = container.width * 0.5 - 5;
      weapon.y = container.height * 0.5;
      container.add(weapon);
      container.x = this.width * 0.5 - 8;
      container.y = this.height * 0.5 - container.height * 0.5;
      if (this.labelText.text == "") {
        this.itemText.y = this.height * 0.5 - this.itemText.height * 0.5;
      }
    };
    ClassItemButton.prototype.setSkill = function (_data) {};
    ClassItemButton.prototype.setMod = function (_data) {
      var modData = _data; //WeaponDatabase.GetMod(_data["id"]);
      this.itemText.setText(modData["name"], true);
      var container = this.game.add.group();
      this.addChild(container);
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, this.width * 0.5, 50);
      container.add(gfx);
      var mod = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
      mod.scale.set(0.5, 0.5);
      mod.anchor.set(0.5, 0.5);
      mod.x = container.width * 0.5;
      mod.y = container.height * 0.5;
      container.add(mod);
      container.x = this.width * 0.5 - 8;
      container.y = this.height * 0.5 - container.height * 0.5;
      if (this.labelText.text == "") {
        this.itemText.y = this.height * 0.5 - this.itemText.height * 0.5;
      }
    };
    ClassItemButton.BUTTON_HEIGHT = 84;
    return ClassItemButton;
  })(ButtonBase);
  TWP2.ClassItemButton = ClassItemButton;
  var RangeTargetSelectorButton = /** @class */ (function (_super) {
    __extends(RangeTargetSelectorButton, _super);
    function RangeTargetSelectorButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 100, 120);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.icon = _this.game.add.image(0, 0, "atlas_ui", "target_default_default");
      _this.icon.anchor.set(0.5, 0.5);
      _this.icon.x = _this.width * 0.5;
      _this.icon.y = _this.height * 0.5;
      _this.addChild(_this.icon);
      _this.onOut();
      return _this;
    }
    RangeTargetSelectorButton.prototype.destroy = function () {
      this.icon = null;
      _super.prototype.destroy.call(this);
    };
    RangeTargetSelectorButton.prototype.setIcon = function (_id) {
      this.icon.frameName = _id;
    };
    return RangeTargetSelectorButton;
  })(ButtonBase);
  TWP2.RangeTargetSelectorButton = RangeTargetSelectorButton;
  var ControlButton = /** @class */ (function (_super) {
    __extends(ControlButton, _super);
    function ControlButton() {
      var _this = this;
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 240, 80);
      _this = _super.call(this, gfx.generateTexture()) || this;
      gfx.destroy();
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.lineStyle(1, TWP2.ColourUtil.COLOUR_BUTTONS, 0.8);
      gfx.beginFill(TWP2.ColourUtil.COLOUR_BUTTONS, 0.4);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgOver);
      var gfx = TWP2.GameUtil.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRoundedRect(0, 0, _this.width, _this.height, TWP2.GameUtil.RECT_RADIUS);
      _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.addChild(_this.bgUp);
      _this.keyDetail = new TWP2.KeyDetail(0, "", TWP2.KeyDetail.STYLE_DEFAULT);
      _this.addChild(_this.keyDetail);
      _this.labelText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.labelText.setTextBounds(0, 4, _this.width, 20);
      _this.addChild(_this.labelText);
      _this.onOut();
      return _this;
    }
    ControlButton.prototype.updateKey = function (_id) {
      this.keyId = _id;
      this.keyDetail.setKey(TWP2.PlayerUtil.GetControlsData()[_id]);
      this.keyDetail.x = this.width * 0.5 - this.keyDetail.width * 0.5 + 4;
      this.keyDetail.y = this.height * 0.5 - this.keyDetail.height * 0.5 + 8;
      this.labelText.setText(TWP2.PlayerUtil.GetKeyDescription(_id), true);
    };
    ControlButton.prototype.refreshKey = function () {
      if (this.keyId) {
        this.updateKey(this.keyId);
      }
    };
    return ControlButton;
  })(ButtonBase);
  TWP2.ControlButton = ControlButton;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var UIBar = /** @class */ (function (_super) {
    __extends(UIBar, _super);
    function UIBar(_settings) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.currentValue = 0;
      _this.tweenSpeed = 750;
      _this.settings = _settings;
      if (_settings) {
        _this.setTweenFunction(_settings["tweenFunc"]);
        _this.setSize(_settings["w"], _settings["h"]);
        if (_settings["barColour"] != undefined) {
          _this.setBarColour(_settings["barColour"]);
        }
        if (_settings["value"] != undefined) {
          _this.setValue(_settings["value"]);
        } else {
          _this.setValue(0);
        }
        if (_settings["ticks"]) {
          _this.setTicks(_settings["ticks"]);
        }
        if (_settings["blocks"]) {
          _this.setBlocks(_settings["blocks"]);
        }
      }
      return _this;
    }
    UIBar.prototype.destroy = function () {
      this.settings = null;
      this.tweenFunc = null;
      this.bg = null;
      this.bar = null;
      _super.prototype.destroy.call(this);
    };
    UIBar.prototype.setTint = function (_val) {
      this.bar.tint = _val;
    };
    UIBar.prototype.setSize = function (_w, _h) {
      if (this.bg) {
        this.bg.destroy();
      }
      if (this.bar) {
        this.bar.destroy();
      }
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffff, this.settings["bgAlpha"] != undefined ? this.settings["bgAlpha"] : 0.1);
      gfx.drawRect(0, 0, _w, _h);
      this.bg = this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.add(this.bg);
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffff, 1);
      gfx.drawRect(0, 0, _w, _h);
      this.bar = this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.add(this.bar);
      if (this.settings["barAlpha"] != undefined) {
        this.bar.alpha = this.settings["barAlpha"];
      }
      this.bar.scale.x = 0;
      if (!this.barEdge && this.settings["bHideBarEdge"] != true) {
        var gfx = this.game.add.graphics();
        gfx.beginFill(0xffffff, 0.8);
        gfx.drawRect(0, 0, 2, _h);
        this.barEdge = this.game.add.image(0, 0, gfx.generateTexture());
        //this.barEdge.visible = false;
        this.add(this.barEdge);
        gfx.destroy();
      }
    };
    UIBar.prototype.setBlocks = function (_val) {
      var padding = 2;
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xff0000, 0.5);
      var blockWidth = (this.bg.width - padding * (_val - 1)) / _val;
      for (var i = 0; i < _val; i++) {
        gfx.drawRect(i * (blockWidth + (i > 0 ? padding : 0)), 0, blockWidth, this.height);
      }
      this.add(gfx);
      this.bar.mask = gfx;
      this.bg.mask = gfx;
      if (this.barEdge) {
        this.barEdge.mask = gfx;
      }
    };
    UIBar.prototype.setTicks = function (_val) {
      var spacing = this.width / (_val - 1);
      for (var i = 0; i < _val; i++) {
        if (i > 0 && i < _val - 1) {
          var gfx = this.game.add.graphics();
          gfx.beginFill(0xffffff, 0.5);
          var w = 2;
          var h = 2;
          gfx.drawRect(0, 0, w, h);
          var img = this.game.add.image(0, 0, gfx.generateTexture());
          img.x = spacing * i - w * 0.5;
          img.y = this.height * 0.5 - h * 0.5;
          this.addAt(img, 0);
          gfx.destroy();
        }
      }
    };
    UIBar.prototype.setBarColour = function (_val) {
      if (this.bar) {
        this.bar.tint = _val;
      }
    };
    UIBar.prototype.setTweenFunction = function (_func) {
      this.tweenFunc = _func;
    };
    UIBar.prototype.setValue = function (_val) {
      if (isNaN(_val)) {
        _val = 0;
      }
      this.currentValue = Math.max(0.0000000001, Math.min(1, _val));
      if (this.bar) {
        if (this.tweenFunc != null) {
          var tween = this.game.add.tween(this.bar.scale).to({ x: this.currentValue }, this.tweenSpeed, this.tweenFunc, true);
        } else {
          this.bar.scale.x = this.currentValue;
        }
        if (this.settings["bInterpColour"] == true) {
          var interp = Phaser.Color.linearInterpolation(this.settings["colours"], this.currentValue);
          this.bar.tint = interp;
        }
        //this.bar.visible = this.currentValue > 0;
      }
      if (this.barEdge) {
        var desiredX = Math.max(0, Math.min(this.bg.width * this.currentValue - this.barEdge.width, this.bg.width - this.barEdge.width));
        if (this.tweenFunc != null) {
          var tween = this.game.add.tween(this.barEdge).to({ x: desiredX }, this.tweenSpeed, this.tweenFunc, true);
        } else {
          this.barEdge.x = desiredX;
        }
      }
    };
    return UIBar;
  })(Phaser.Group);
  TWP2.UIBar = UIBar;
  var UISlider = /** @class */ (function (_super) {
    __extends(UISlider, _super);
    function UISlider(_settings, _onUpdateCallback, _onUpdateCallbackContext) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.value = 0;
      _this.min = 0;
      _this.max = 1;
      _this.increment = 1;
      _this.bIsDragging = false;
      _this.onUpdateCallback = _onUpdateCallback;
      _this.onUpdateCallbackContext = _onUpdateCallbackContext;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.1);
      gfx.drawRect(0, 0, 2, 4);
      _this.bg = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.add(_this.bg);
      _this.fill = _this.game.add.graphics();
      _this.fill.beginFill(0xffffff, 0.8);
      _this.fill.drawRect(0, 0, 32, 8);
      _this.fill.y = 3;
      _this.fill.alpha = 0.8;
      _this.add(_this.fill);
      gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 1);
      gfx.drawCircle(0, 0, 14);
      _this.thumb = new TWP2.ImageButton(gfx.generateTexture());
      _this.thumb.setBaseAlpha(1);
      gfx.destroy();
      _this.thumb.anchor.set(0.5, 0);
      _this.thumb.x = -_this.thumb.width * 0.5;
      _this.add(_this.thumb);
      _this.bg.y = _this.thumb.height * 0.5 - _this.bg.height * 0.5;
      if (_settings) {
        if (_settings["increment"] != undefined) {
          _this.increment = _settings["increment"];
        }
        if (_settings["w"]) {
          _this.setWidth(_settings["w"]);
        }
        _this.setMin(_settings["min"]);
        _this.setMax(_settings["max"]);
        if (_settings["value"] != undefined) {
          _this.setValue(_settings["value"], true);
        } else {
          _this.setValue(0, true);
        }
        _this.updateTicks();
      }
      _this.thumb.input.enableDrag();
      _this.thumb.input.setDragLock(true, false);
      _this.thumb.input.boundsRect = new Phaser.Rectangle(_this.thumb.x, 0, _this.bg.width + _this.thumb.width * 0.5, _this.height);
      _this.thumb.events.onDragStart.add(_this.onThumbDown, _this);
      _this.thumb.events.onDragStop.add(_this.onThumbUp, _this);
      _this.thumb.events.onDragUpdate.add(_this.onThumbUpdate, _this);
      return _this;
    }
    UISlider.prototype.destroy = function () {
      this.onUpdateCallback = null;
      this.onUpdateCallbackContext = null;
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = null;
      this.thumb = null;
      _super.prototype.destroy.call(this);
    };
    UISlider.prototype.update = function () {
      if (this.fill) {
        if (this.fill.width != this.thumb.x) {
          this.fill.width = this.thumb.x;
          var desiredTint = Phaser.Color.linearInterpolation([0xffffff, TWP2.ColourUtil.COLOUR_GREEN], this.thumb.x / this.width);
          if (this.fill.tint != desiredTint) {
            this.fill.tint = desiredTint;
          }
        }
      }
      _super.prototype.update.call(this);
    };
    UISlider.prototype.onThumbDown = function (sprite, pointer) {
      this.bIsDragging = true;
    };
    UISlider.prototype.onThumbUp = function (sprite, pointer) {
      this.bIsDragging = false;
      this.updateThumb();
    };
    UISlider.prototype.onThumbUpdate = function (sprite, pointer) {
      this.setValueFromPercent(this.thumb.x / this.bg.width);
    };
    UISlider.prototype.updateTicks = function () {
      if (this.increment) {
        var gfx = this.game.add.graphics();
        var width = 2;
        var numTicks = this.max / this.increment;
        var tickInterval = this.bg.width / (this.max / this.increment);
        for (var i = 0; i < numTicks - 1; i++) {
          gfx.beginFill(0xffffff, 0.2);
          gfx.drawRect(Math.round(i * tickInterval), 0, width, this.bg.height * 0.5);
        }
        var img = this.game.add.image(0, 0, gfx.generateTexture());
        gfx.destroy();
        img.x = tickInterval;
        img.y = this.bg.y + 1;
        this.add(img);
      }
    };
    UISlider.prototype.updateThumb = function () {
      var desiredX = 0;
      if (this.max > 1) {
        desiredX = Math.floor((this.value / this.max) * this.bg.width);
      } else {
        desiredX = Math.floor(this.value * this.bg.width);
      }
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = this.game.add.tween(this.thumb).to({ x: desiredX }, 200, Phaser.Easing.Exponential.Out, true);
    };
    UISlider.prototype.setWidth = function (_val) {
      if (this.bg) {
        this.bg.width = _val;
      }
    };
    UISlider.prototype.setMin = function (_val) {
      this.min = _val;
    };
    UISlider.prototype.setMax = function (_val) {
      this.max = _val;
    };
    UISlider.prototype.setValue = function (_val, _bUpdate) {
      if (_bUpdate === void 0) {
        _bUpdate = false;
      }
      if (isNaN(_val)) {
        return;
      }
      this.value = this.roundToNearestIncrement(_val);
      var str = this.value.toString();
      if (this.max <= 1) {
        str = Math.round(this.value * 100).toString();
      }
      if (_bUpdate) {
        this.updateThumb();
      }
      if (this.onUpdateCallback) {
        this.onUpdateCallback.apply(this.onUpdateCallbackContext, [this.value]);
      }
    };
    UISlider.prototype.roundToNearestIncrement = function (_val) {
      return Math.ceil(_val / this.increment) * this.increment;
    };
    UISlider.prototype.setValueFromPercent = function (_val) {
      var val = this.max * _val + this.min * _val;
      if (this.max > 1) {
        val = Math.round(val);
        val = Math.min(this.max, val);
        val = Math.max(this.min, val);
      }
      this.setValue(val);
    };
    UISlider.prototype.getValue = function () {
      return this.value;
    };
    return UISlider;
  })(Phaser.Group);
  TWP2.UISlider = UISlider;
  var ProfileWidget = /** @class */ (function (_super) {
    __extends(ProfileWidget, _super);
    function ProfileWidget() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0xffffff, 0.05);
      bg.drawRoundedRect(0, 0, 162, 50, TWP2.GameUtil.RECT_RADIUS);
      _this.add(bg);
      _this.levelText = _this.game.add.text(0, 0, "", { font: "40px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "left", boundsAlignV: "middle" });
      _this.levelText.setTextBounds(0, 0, 100, 40);
      _this.levelText.x = 4;
      _this.levelText.y = bg.height * 0.5 - _this.levelText.height * 0.5 + 4;
      _this.add(_this.levelText);
      _this.xpText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "left", boundsAlignV: "middle" });
      _this.xpText.setTextBounds(0, 0, 60, 20);
      _this.xpText.y = _this.levelText.y + _this.levelText.height * 0.5 - _this.xpText.height * 0.5;
      _this.add(_this.xpText);
      _this.xpText.visible = false;
      _this.moneyText = _this.game.add.text(0, 0, "", { font: "20px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING, boundsAlignH: "right", boundsAlignV: "middle" });
      _this.moneyText.setTextBounds(0, 0, 100, 20);
      _this.moneyText.x = bg.width - 104;
      _this.moneyText.y = bg.height * 0.5 - _this.moneyText.height * 0.5 + 4;
      _this.add(_this.moneyText);
      _this.xpBar = new UIBar({
        w: bg.width - 8,
        h: 2,
        blocks: 5,
        barColour: TWP2.ColourUtil.COLOUR_XP,
        value: TWP2.PlayerUtil.GetCurrentXPPercent(),
      });
      _this.xpBar.x = bg.width * 0.5 - _this.xpBar.width * 0.5;
      _this.xpBar.y = bg.height - _this.xpBar.height - 4;
      _this.add(_this.xpBar);
      _this.prestigeIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_prestige");
      _this.prestigeIcon.tint = TWP2.ColourUtil.COLOUR_XP;
      _this.prestigeIcon.alpha = 0.1;
      _this.prestigeIcon.y = bg.height * 0.5 - _this.prestigeIcon.height * 0.5 - 2;
      _this.add(_this.prestigeIcon);
      _this.prestigeIcon.visible = false;
      _this.updateInfo();
      return _this;
    }
    ProfileWidget.prototype.updateInfo = function () {
      this.moneyText.setText("$" + TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player["money"]), true);
      this.levelText.setText(TWP2.PlayerUtil.player["level"].toString(), true);
      this.xpText.setText(TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player["xp"]) + "XP", true);
      this.xpText.x = this.levelText.x + this.levelText.width + 4;
      this.xpBar.setValue(TWP2.PlayerUtil.GetCurrentXPPercent());
      this.prestigeIcon.x = this.levelText.x + this.levelText.width + 2;
      this.prestigeIcon.visible = TWP2.PlayerUtil.IsPrestiged();
    };
    return ProfileWidget;
  })(Phaser.Group);
  TWP2.ProfileWidget = ProfileWidget;
  var StatsContainer = /** @class */ (function (_super) {
    __extends(StatsContainer, _super);
    function StatsContainer() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var padding = 4;
      _this.damageStat = new TWP2.WeaponStat("Damage");
      _this.add(_this.damageStat);
      _this.accuracyStat = new TWP2.WeaponStat("Accuracy");
      _this.accuracyStat.y = _this.height + padding;
      _this.add(_this.accuracyStat);
      _this.rofStat = new TWP2.WeaponStat("Fire Rate");
      _this.rofStat.y = _this.height + padding;
      _this.add(_this.rofStat);
      _this.penetrationStat = new TWP2.WeaponStat("Penetration");
      _this.penetrationStat.y = _this.height + padding;
      _this.add(_this.penetrationStat);
      _this.recoilStat = new TWP2.WeaponStat("Recoil");
      _this.recoilStat.y = _this.height + padding;
      _this.recoilStat.setInverted(true);
      _this.add(_this.recoilStat);
      _this.reloadStat = new TWP2.WeaponStat("Reload Speed");
      _this.reloadStat.y = _this.height + padding;
      _this.reloadStat.setInverted(true);
      _this.add(_this.reloadStat);
      return _this;
    }
    StatsContainer.prototype.setWeapon = function (_data, _mods) {
      if (!_mods) {
        _mods = {};
      }
      var modifierData = {
        damage: 1,
        headshotDamage: 1,
        accuracy: 1,
        penetration: 1,
        fireRate: 1,
        recoil: 1,
      };
      for (var id in _mods) {
        var mod = TWP2.WeaponDatabase.GetMod(_mods[id]);
        var modifiers = mod["modifiers"];
        for (var modifierId in modifiers) {
          modifierData[modifierId] *= modifiers[modifierId];
          modifierData[modifierId] = Math.max(0, modifierData[modifierId]);
        }
      }
      var useDamage = _data["damage"];
      if (_data["type"] == TWP2.WeaponDatabase.TYPE_SHOTGUN) {
        useDamage *= 3;
      }
      var damageMax = useDamage > 40 ? 120 : 80;
      var defaultDamage = useDamage / damageMax;
      this.setDamageValue(defaultDamage, defaultDamage * modifierData["damage"] * modifierData["headshotDamage"]);
      var accuracyMax = _data["accuracy"] > 10 ? 20 : 12;
      var defaultAccuracy = _data["accuracy"] / accuracyMax;
      this.setAccuracyValue(1 - defaultAccuracy, 1 - defaultAccuracy * modifierData["accuracy"]);
      var defaultPenetration = _data["penetration"] / 8;
      this.setPenetrationValue(defaultPenetration, defaultPenetration * modifierData["penetration"]);
      var defaultRecoil = _data["recoil"] / 20;
      if (_data["bLowRecoil"]) {
        defaultRecoil *= 0.5;
      }
      if (_data["type"] == TWP2.WeaponDatabase.TYPE_LMG) {
        defaultRecoil *= 2;
      }
      this.setRecoilValue(defaultRecoil, defaultRecoil * modifierData["recoil"]);
      var rofMax = _data["fireRate"] > 15 ? 65 : 30;
      var defaultROF = _data["fireRate"] / rofMax;
      this.setROFValue(1 - defaultROF, 1 - defaultROF * modifierData["fireRate"]);
      var defaultReload = _data["reloadTime"] / 4;
      this.setReloadValue(1 - defaultReload, 1 - defaultReload);
    };
    StatsContainer.prototype.setDamageValue = function (_val, _modifier) {
      this.damageStat.setValue(_val);
      this.damageStat.setModifierValue(_modifier);
    };
    StatsContainer.prototype.setAccuracyValue = function (_val, _modifier) {
      this.accuracyStat.setValue(_val);
      this.accuracyStat.setModifierValue(_modifier);
    };
    StatsContainer.prototype.setROFValue = function (_val, _modifier) {
      this.rofStat.setValue(_val);
      this.rofStat.setModifierValue(_modifier);
    };
    StatsContainer.prototype.setPenetrationValue = function (_val, _modifier) {
      this.penetrationStat.setValue(_val);
      this.penetrationStat.setModifierValue(_modifier);
    };
    StatsContainer.prototype.setRecoilValue = function (_val, _modifier) {
      this.recoilStat.setValue(_val);
      this.recoilStat.setModifierValue(_modifier);
    };
    StatsContainer.prototype.setReloadValue = function (_val, _modifier) {
      this.reloadStat.setValue(_val);
      this.reloadStat.setModifierValue(_modifier);
    };
    return StatsContainer;
  })(Phaser.Group);
  TWP2.StatsContainer = StatsContainer;
  var UnlockItem = /** @class */ (function (_super) {
    __extends(UnlockItem, _super);
    function UnlockItem() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.bg = _this.game.add.graphics();
      _this.bg.beginFill(0xffffff, 0.05);
      _this.bg.drawRoundedRect(0, 0, 230, 90, TWP2.GameUtil.RECT_RADIUS);
      _this.add(_this.bg);
      var newIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_new");
      newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
      newIcon.x = _this.width - newIcon.width - 2;
      newIcon.y = 2;
      _this.add(newIcon);
      _this.labelText = _this.game.add.text(0, 4, "", { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 0, _this.bg.width, 20);
      _this.add(_this.labelText);
      _this.typeText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.typeText.alpha = 0.2;
      _this.typeText.setTextBounds(0, 0, _this.bg.width, 20);
      _this.typeText.y = _this.bg.height - _this.typeText.height;
      _this.add(_this.typeText);
      return _this;
    }
    UnlockItem.prototype.destroy = function () {
      this.labelText = null;
      this.typeText = null;
      this.bg = null;
      _super.prototype.destroy.call(this);
    };
    UnlockItem.prototype.setFromData = function (_data) {
      if (_data) {
        if (_data["type"] == "weapon") {
          var weapon = TWP2.WeaponDatabase.GetWeapon(_data["id"]);
          this.labelText.addColor(TWP2.ColourUtil.COLOUR_XP_STRING, 0);
          this.labelText.setText(weapon["name"], true);
          var icon = this.game.add.image(0, 0, "atlas_weapons_icons_small", weapon["id"]);
          icon.x = this.bg.width * 0.5 - icon.width * 0.5;
          icon.y = this.bg.height * 0.5 - icon.height * 0.5;
          this.add(icon);
          this.typeText.setText(TWP2.WeaponDatabase.GetTypeString(weapon["type"]), true);
          var bg = this.game.add.graphics();
          bg.beginFill(TWP2.ColourUtil.COLOUR_GREEN, 0.05);
          bg.drawRoundedRect(0, 0, this.width, this.height, TWP2.GameUtil.RECT_RADIUS);
          this.addAt(bg, 0);
        } else if (_data["type"] == "mod") {
          var weapon = TWP2.WeaponDatabase.GetWeapon(_data["data"]["weaponId"]);
          var mod = TWP2.WeaponDatabase.GetMod(_data["id"]);
          var weaponIcon = this.game.add.image(0, 0, "atlas_weapons_icons_small", weapon["id"]);
          weaponIcon.scale.set(0.8, 0.8);
          weaponIcon.anchor.set(0.5, 0.5);
          weaponIcon.x = this.width * 0.3;
          weaponIcon.y = this.height * 0.5;
          this.add(weaponIcon);
          var icon = this.game.add.image(0, 0, "atlas_ui", mod["id"]);
          icon.anchor.set(0.5, 0.5);
          icon.x = this.width * 0.7;
          icon.y = this.height * 0.5;
          this.add(icon);
          var str = weapon["name"] + ": " + mod["name"];
          this.labelText.setText(str, true);
          var index = str.indexOf(weapon["name"]);
          this.labelText.addColor("#FFFFFF", index);
          this.labelText.addColor(TWP2.ColourUtil.COLOUR_XP_STRING, weapon["name"].length + 2);
          this.typeText.setText(TWP2.WeaponDatabase.GetModString(mod["type"]) + " Mod", true);
        }
      }
    };
    return UnlockItem;
  })(Phaser.Group);
  TWP2.UnlockItem = UnlockItem;
  var ProfileStat = /** @class */ (function (_super) {
    __extends(ProfileStat, _super);
    function ProfileStat(_labelText, _value) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.5);
      bg.drawRoundedRect(0, 0, 180, 60, TWP2.GameUtil.RECT_RADIUS);
      _this.add(bg);
      _this.labelText = _this.game.add.text(0, 0, _labelText, { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      _this.labelText.setTextBounds(0, 0, bg.width, 20);
      _this.labelText.alpha = 0.8;
      _this.labelText.y = 12;
      _this.add(_this.labelText);
      _this.valueText = _this.game.add.text(0, 0, isNaN(_value) ? _value : TWP2.GameUtil.FormatNum(_value), { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      _this.valueText.setTextBounds(0, 0, bg.width, 20);
      _this.valueText.y = _this.labelText.y + _this.labelText.height;
      _this.add(_this.valueText);
      return _this;
    }
    ProfileStat.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    return ProfileStat;
  })(Phaser.Group);
  TWP2.ProfileStat = ProfileStat;
  var SkillBranch = /** @class */ (function (_super) {
    __extends(SkillBranch, _super);
    function SkillBranch(_onAddCallback, _onAddCallbackContext) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.onAddCallback = _onAddCallback;
      _this.onAddCallbackContext = _onAddCallbackContext;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.5);
      bg.drawRoundedRect(0, 0, 600, 102, TWP2.GameUtil.RECT_RADIUS);
      _this.add(bg);
      var textContainer = _this.game.add.group();
      _this.labelText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      TWP2.GameUtil.SetTextShadow(_this.labelText);
      _this.labelText.setTextBounds(0, 0, 240, 20);
      textContainer.add(_this.labelText);
      _this.descText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      _this.descText.setTextBounds(0, 0, 240, 20);
      _this.descText.alpha = 0.8;
      _this.descText.y = _this.labelText.y + _this.labelText.height - 2;
      textContainer.add(_this.descText);
      textContainer.y = _this.height * 0.5 - textContainer.height * 0.5;
      _this.add(textContainer);
      _this.container = _this.game.add.group();
      for (var i = 0; i < TWP2.PlayerUtil.MAX_SKILLS; i++) {
        var gfx = _this.game.add.graphics();
        gfx.beginFill(0xffffff, 1);
        gfx.drawRect(0, 0, 20, 40);
        var img = _this.game.add.image(0, 0, gfx.generateTexture());
        gfx.destroy();
        img.anchor.set(0.5, 0.5);
        img.x = i * (img.width + (i > 0 ? 8 : 0)) + img.width * 0.5;
        img.y = img.height * 0.5;
        img.alpha = 0.1;
        _this.container.add(img);
      }
      _this.container.x = _this.width - _this.container.width - 10;
      _this.container.y = _this.height * 0.5 - _this.container.height * 0.5;
      _this.add(_this.container);
      _this.addButton = new TWP2.AddButton();
      _this.addButton.setCallback(_this.onAddClicked, _this);
      _this.addButton.x = _this.width + 4;
      _this.add(_this.addButton);
      _this.checkmark = _this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      _this.checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
      _this.checkmark.x = _this.labelText.x + _this.labelText.textBounds.width + 4;
      _this.checkmark.y = _this.height * 0.5 - _this.checkmark.height * 0.5;
      _this.add(_this.checkmark);
      return _this;
    }
    SkillBranch.prototype.destroy = function () {
      this.data = null;
      _super.prototype.destroy.call(this);
    };
    SkillBranch.prototype.getSkillId = function () {
      return this.data["id"];
    };
    SkillBranch.prototype.onAddClicked = function () {
      this.onAddCallback.apply(this.onAddCallbackContext, [this.data["id"]]);
    };
    SkillBranch.prototype.setSkill = function (_data) {
      this.data = _data;
      this.labelText.setText(_data["name"], true);
      this.descText.setText(_data["desc"], true);
    };
    SkillBranch.prototype.setSkillValue = function (_val) {
      for (var i = 0; i < this.container.length; i++) {
        var item = this.container.getChildAt(i);
        var bValid = i + 1 <= _val;
        item.alpha = bValid ? 0.8 : 0.1;
      }
      var bMaxSkills = _val >= TWP2.PlayerUtil.MAX_SKILLS;
      for (var i = 0; i < this.container.length; i++) {
        var img = this.container.getAt(i);
        if (img) {
          img.tint = bMaxSkills ? TWP2.ColourUtil.COLOUR_GREEN : TWP2.ColourUtil.COLOUR_SKILL;
        }
      }
      this.checkmark.visible = bMaxSkills;
    };
    SkillBranch.prototype.animate = function () {
      var lastValid;
      for (var i = 0; i < this.container.length; i++) {
        var item = this.container.getChildAt(i);
        var bValid = item.alpha == 0.8;
        if (bValid) {
          lastValid = item;
        }
      }
      if (lastValid) {
        var tweenScale = 0;
        var tween = this.game.add.tween(lastValid.scale).from({ x: tweenScale, y: tweenScale }, 200, Phaser.Easing.Exponential.Out, true);
      }
    };
    SkillBranch.prototype.setAddButtonEnabled = function (_bVal) {
      this.addButton.setEnabled(_bVal);
    };
    return SkillBranch;
  })(Phaser.Group);
  TWP2.SkillBranch = SkillBranch;
  var SliderGroup = /** @class */ (function (_super) {
    __extends(SliderGroup, _super);
    function SliderGroup(_labelText) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.35);
      bg.drawRect(0, 0, 600, 60);
      _this.add(bg);
      _this.labelText = _this.game.add.text(0, 0, _labelText, { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 2, 150, bg.height);
      _this.add(_this.labelText);
      _this.slider = new UISlider(
        {
          w: bg.width - _this.labelText.textBounds.width - 30,
          increment: 10,
          min: 0,
          max: 100,
          value: 0,
        },
        null,
        null
      );
      _this.slider.x = _this.labelText.x + _this.labelText.textBounds.width;
      _this.slider.y = bg.height * 0.5 - _this.slider.height * 0.5;
      _this.add(_this.slider);
      return _this;
    }
    SliderGroup.prototype.destroy = function () {
      this.slider = null;
      this.labelText = null;
      _super.prototype.destroy.call(this);
    };
    SliderGroup.prototype.getSlider = function () {
      return this.slider;
    };
    return SliderGroup;
  })(Phaser.Group);
  TWP2.SliderGroup = SliderGroup;
  var VolumeToggler = /** @class */ (function (_super) {
    __extends(VolumeToggler, _super);
    function VolumeToggler() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.updateImage();
      return _this;
    }
    VolumeToggler.prototype.destroy = function () {
      this.image = null;
      this.callback = null;
      this.callbackContext = null;
      _super.prototype.destroy.call(this);
    };
    VolumeToggler.prototype.setCallback = function (_callback, _callbackContext) {
      this.callback = _callback;
      this.callbackContext = _callbackContext;
    };
    VolumeToggler.prototype.updateImage = function () {
      if (this.image) {
        this.image.destroy();
      }
      var bMuted = TWP2.PlayerUtil.player.settings["gameVolume"] == 0 && TWP2.PlayerUtil.player.settings["musicVolume"] == 0;
      this.image = new TWP2.ImageButton("atlas_ui", bMuted ? "icon_mute" : "icon_volume");
      this.image.setCallback(this.toggle, this);
      this.add(this.image);
    };
    VolumeToggler.prototype.toggle = function () {
      var bMuted = TWP2.PlayerUtil.player.settings["gameVolume"] == 0 && TWP2.PlayerUtil.player.settings["musicVolume"] == 0;
      if (bMuted) {
        TWP2.PlayerUtil.player.settings["gameVolume"] = 1;
        TWP2.PlayerUtil.player.settings["musicVolume"] = 1;
        TWP2.SoundManager.SetMute(false);
      } else {
        TWP2.PlayerUtil.player.settings["gameVolume"] = 0;
        TWP2.PlayerUtil.player.settings["musicVolume"] = 0;
      }
      TWP2.SoundManager.UpdateMusicVolume();
      if (this.callback) {
        this.callback.apply(this.callbackContext);
      }
    };
    return VolumeToggler;
  })(Phaser.Group);
  TWP2.VolumeToggler = VolumeToggler;
  var Leaderboards = /** @class */ (function (_super) {
    __extends(Leaderboards, _super);
    function Leaderboards() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.5);
      bg.drawRoundedRect(0, 0, 448, 330, TWP2.GameUtil.RECT_RADIUS);
      _this.add(bg);
      _this.container = _this.game.add.group();
      _this.container.y = 8;
      _this.add(_this.container);
      return _this;
    }
    Leaderboards.prototype.destroy = function () {
      this.container = null;
      this.submitContainer = null;
      _super.prototype.destroy.call(this);
    };
    Leaderboards.prototype.setSubmitContainer = function (_val) {
      this.submitContainer = _val;
    };
    Leaderboards.prototype.getSubmitContainer = function () {
      return this.submitContainer;
    };
    Leaderboards.prototype.debug = function () {
      var arr = [];
      for (var i = 0; i < 20; i++) {
        var player = {
          name: "Player " + (i + 1),
          score: 1000 - i * 5,
        };
        arr.push(player);
      }
      this.setScores(arr);
    };
    Leaderboards.prototype.loadScores = function (_gameId) {
      this.gameId = _gameId;
      this.setLoadingScores();
      TWP2.APIUtil.LoadLeaderboards(_gameId, this);
    };
    Leaderboards.prototype.refresh = function () {
      if (this.gameId) {
        this.loadScores(this.gameId);
      }
    };
    Leaderboards.prototype.setLoadingScores = function () {
      this.container.removeAll(true);
      var loadContainer = this.game.add.group();
      var spinner = TWP2.GameUtil.CreateSpinner();
      loadContainer.add(spinner);
      var loadingText = this.game.add.text(0, 0, "Loading scores...", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      loadingText.y = spinner.height * 0.5 + 8;
      loadContainer.add(loadingText);
      spinner.x = loadingText.width * 0.5;
      loadContainer.x = this.width * 0.5 - loadContainer.width * 0.5;
      loadContainer.y = this.height * 0.5 - this.container.height - loadContainer.height * 0.5;
      this.container.add(loadContainer);
    };
    Leaderboards.prototype.setScores = function (_scores) {
      if (!this.container || !this.game) {
        return;
      }
      this.container.removeAll(true);
      var len = Math.min(10, _scores.length);
      if (len > 0) {
        var heading = new LeaderboardPlayer(true);
        heading.x = this.width * 0.5 - heading.width * 0.5;
        this.container.add(heading);
        for (var i = 0; i < len; i++) {
          var cur = _scores[i];
          var player = new LeaderboardPlayer(false, i + 1, cur["name"], cur["score"]);
          player.x = this.width * 0.5 - player.width * 0.5;
          player.y = this.container.height + 2;
          this.container.add(player);
        }
      } else {
        var noneText = this.game.add.text(0, 0, "No scores", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        noneText.alpha = 0.5;
        noneText.x = this.width * 0.5 - noneText.width * 0.5;
        noneText.y = this.height * 0.5 - this.container.y - noneText.height * 0.5;
        this.container.add(noneText);
      }
    };
    Leaderboards.prototype.setError = function () {
      this.container.removeAll(true);
      var errorContainer = this.game.add.group();
      var errorIcon = this.game.add.image(0, 0, "atlas_ui", "icon_alert");
      errorIcon.alpha = 0.5;
      errorIcon.anchor.set(0.5, 0.5);
      errorIcon.tint = TWP2.ColourUtil.COLOUR_RED;
      errorContainer.add(errorIcon);
      var errorText = this.game.add.text(0, 0, "Error loading leaderboards!", { font: "14px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_RED_STRING });
      errorText.y = errorIcon.height * 0.5 + 4;
      errorContainer.add(errorText);
      errorIcon.x = errorText.width * 0.5;
      errorContainer.x = this.width * 0.5 - errorContainer.width * 0.5;
      errorContainer.y = this.height * 0.5 - this.container.height - errorContainer.height * 0.5;
      this.container.add(errorContainer);
    };
    Leaderboards.prototype.setUnavailable = function () {
      this.container.removeAll(true);
      var errorContainer = this.game.add.group();
      var errorIcon = this.game.add.image(0, 0, "atlas_ui", "icon_alert");
      errorIcon.alpha = 0.5;
      errorIcon.anchor.set(0.5, 0.5);
      errorIcon.tint = TWP2.ColourUtil.COLOUR_XP;
      errorContainer.add(errorIcon);
      var errorText = this.game.add.text(0, 0, "Leaderboards currently unavailable!", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      errorText.alpha = 0.5;
      errorText.y = errorIcon.height * 0.5 + 4;
      errorContainer.add(errorText);
      errorIcon.x = errorText.width * 0.5;
      errorContainer.x = this.width * 0.5 - errorContainer.width * 0.5;
      errorContainer.y = this.height * 0.5 - this.container.height - errorContainer.height * 0.5;
      this.container.add(errorContainer);
    };
    return Leaderboards;
  })(Phaser.Group);
  TWP2.Leaderboards = Leaderboards;
  var LeaderboardPlayer = /** @class */ (function (_super) {
    __extends(LeaderboardPlayer, _super);
    function LeaderboardPlayer(_bHeading, _num, _name, _score) {
      if (_num === void 0) {
        _num = 0;
      }
      if (_name === void 0) {
        _name = null;
      }
      if (_score === void 0) {
        _score = 0;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0xffffff, 0.1);
      bg.drawRect(0, 0, 420, 24);
      _this.add(bg);
      _this.numText = _this.game.add.text(0, 0, _num.toString(), { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.numText.alpha = 0.1;
      _this.numText.setTextBounds(0, 3, 50, bg.height);
      _this.numText.x = 20;
      _this.add(_this.numText);
      _this.nameText = _this.game.add.text(0, 0, _name, { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
      _this.nameText.setTextBounds(0, 3, 200, bg.height);
      _this.nameText.x = _this.numText.x + _this.numText.textBounds.width + 10;
      _this.add(_this.nameText);
      _this.scoreText = _this.game.add.text(0, 0, TWP2.GameUtil.FormatNum(_score), { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      _this.scoreText.setTextBounds(0, 3, 100, bg.height);
      _this.scoreText.x = _this.width - _this.scoreText.textBounds.width;
      _this.add(_this.scoreText);
      if (_bHeading) {
        _this.numText.setStyle({ font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        _this.numText.alpha = 0.5;
        _this.numText.setText("Rank", true);
        _this.nameText.setStyle({ font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
        _this.nameText.alpha = 0.5;
        _this.nameText.setText("Player", true);
        _this.scoreText.setStyle({ font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        _this.scoreText.alpha = 0.5;
        _this.scoreText.setText("Score", true);
        bg.alpha = 0;
      } else {
        _this.trophy = _this.game.add.image(0, 0, "atlas_ui", "icon_trophy");
        _this.trophy.x = 4;
        _this.trophy.y = _this.height * 0.5 - _this.trophy.height * 0.5;
        if (_num == 1) {
          _this.trophy.tint = 0xffd662;
        } else if (_num == 2) {
          _this.trophy.tint = 0xbec5cc;
        } else if (_num == 3) {
          _this.trophy.tint = 0x746752;
        } else {
          _this.trophy.alpha = 0.1;
        }
        _this.add(_this.trophy);
      }
      return _this;
    }
    LeaderboardPlayer.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    return LeaderboardPlayer;
  })(Phaser.Group);
  TWP2.LeaderboardPlayer = LeaderboardPlayer;
  var KeyDetail = /** @class */ (function (_super) {
    __extends(KeyDetail, _super);
    function KeyDetail(_key, _desc, _style) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.keyStyle = _style;
      _this.descText = _this.game.add.text(0, 0, _desc, { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.add(_this.descText);
      _this.setKey(_key);
      return _this;
    }
    KeyDetail.prototype.destroy = function () {
      this.keyIcon = null;
      _super.prototype.destroy.call(this);
    };
    KeyDetail.prototype.setKey = function (_key) {
      if (this.keyIcon) {
        this.keyIcon.destroy();
      }
      this.keyIcon = new KeyIcon(TWP2.GameUtil.GetKeySize(_key), this.keyStyle);
      this.keyIcon.setKey(_key);
      this.add(this.keyIcon);
      this.descText.x = this.keyIcon.width + 8;
      this.descText.y = this.keyIcon.height * 0.5 - this.descText.height * 0.5 + 3;
    };
    KeyDetail.prototype.setDescText = function (_val) {
      this.descText.setText(_val, true);
    };
    KeyDetail.STYLE_DEFAULT = "STYLE_DEFAULT";
    KeyDetail.STYLE_GAME = "STYLE_GAME";
    return KeyDetail;
  })(Phaser.Group);
  TWP2.KeyDetail = KeyDetail;
  var PlayerRankItem = /** @class */ (function (_super) {
    __extends(PlayerRankItem, _super);
    function PlayerRankItem(_rank) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.rankIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_rank_1");
      _this.rankIcon.scale.set(0.5, 0.5);
      _this.rankIcon.tint = TWP2.ColourUtil.COLOUR_XP;
      _this.add(_this.rankIcon);
      _this.rankText = _this.game.add.text(0, _this.rankIcon.height, "", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      _this.add(_this.rankText);
      _this.setRank(_rank);
      return _this;
    }
    PlayerRankItem.prototype.destroy = function () {
      this.rankIcon = null;
      this.rankText = null;
      _super.prototype.destroy.call(this);
    };
    PlayerRankItem.prototype.setRank = function (_val) {
      this.rankIcon.frameName = TWP2.PlayerUtil.GetRankIdFor(_val);
      this.rankText.setText(_val.toString());
      this.rankText.x = this.rankIcon.width * 0.5 - this.rankText.width * 0.5;
    };
    return PlayerRankItem;
  })(Phaser.Group);
  TWP2.PlayerRankItem = PlayerRankItem;
  var RankBar = /** @class */ (function (_super) {
    __extends(RankBar, _super);
    function RankBar(_w) {
      if (_w === void 0) {
        _w = 800;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.xpBar = new UIBar({
        w: _w,
        h: 4,
        blocks: 6,
        barColour: TWP2.ColourUtil.COLOUR_XP,
        tweenFunc: Phaser.Easing.Exponential.Out,
      });
      _this.add(_this.xpBar);
      _this.updateForCurrentPlayer();
      return _this;
    }
    RankBar.prototype.destroy = function () {
      this.xpBar = null;
      _super.prototype.destroy.call(this);
    };
    RankBar.prototype.updateForCurrentPlayer = function () {
      this.updateRank();
      this.updateXP();
    };
    RankBar.prototype.updateXP = function () {
      this.xpBar.setValue(TWP2.PlayerUtil.GetCurrentXPPercent());
    };
    RankBar.prototype.updateRank = function () {
      var rank = TWP2.PlayerUtil.player["level"];
    };
    return RankBar;
  })(Phaser.Group);
  TWP2.RankBar = RankBar;
  var GameStat = /** @class */ (function (_super) {
    __extends(GameStat, _super);
    function GameStat(_title, _val, _size, _colour) {
      if (_size === void 0) {
        _size = 22;
      }
      if (_colour === void 0) {
        _colour = TWP2.ColourUtil.COLOUR_XP_STRING;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, 120, 50);
      _this.add(gfx);
      var titleText = _this.game.add.text(0, 0, _title, { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      titleText.x = _this.width * 0.5 - titleText.width * 0.5;
      _this.add(titleText);
      _this.valueText = _this.game.add.text(0, 0, _val, { font: _size + "px " + TWP2.FontUtil.FONT, fill: _colour, boundsAlignH: "center" });
      _this.valueText.x = _this.width * 0.5 - _this.valueText.width * 0.5;
      _this.valueText.y = titleText.y + titleText.height;
      _this.add(_this.valueText);
      return _this;
    }
    GameStat.prototype.destroy = function () {
      this.valueText = null;
    };
    GameStat.prototype.getValueText = function () {
      return this.valueText;
    };
    return GameStat;
  })(Phaser.Group);
  TWP2.GameStat = GameStat;
  var KeyIcon = /** @class */ (function (_super) {
    __extends(KeyIcon, _super);
    function KeyIcon(_size, _style) {
      if (_size === void 0) {
        _size = 32;
      }
      if (_style === void 0) {
        _style = KeyDetail.STYLE_DEFAULT;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var gfx = _this.game.add.graphics();
      if (_style == KeyDetail.STYLE_DEFAULT) {
        gfx.beginFill(0x000000, 0.8);
      } else if (_style == KeyDetail.STYLE_GAME) {
        gfx.beginFill(0xffffff, 0.5);
      }
      gfx.drawRoundedRect(0, 0, _size, 32, TWP2.GameUtil.RECT_RADIUS);
      var bg = _this.game.add.image(0, 0, gfx.generateTexture());
      _this.add(bg);
      gfx.destroy();
      _this.keyText = _this.game.add.text(0, 0, "", { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.keyText.setTextBounds(0, 3, bg.width, bg.height);
      _this.add(_this.keyText);
      return _this;
    }
    KeyIcon.prototype.destroy = function () {
      this.keyText = null;
      _super.prototype.destroy.call(this);
    };
    KeyIcon.prototype.setKey = function (_val) {
      this.keyText.setText(TWP2.GameUtil.GetKeyStringFromId(_val), true);
    };
    return KeyIcon;
  })(Phaser.Group);
  TWP2.KeyIcon = KeyIcon;
  var Modifier = /** @class */ (function (_super) {
    __extends(Modifier, _super);
    function Modifier(_id, _modifierType, _data) {
      if (_data === void 0) {
        _data = null;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.selectedIndex = 0;
      _this.bEnabled = true;
      _this.id = _id;
      _this.modifierType = _modifierType;
      var buttonWidth = 120;
      var desiredHeight = 40;
      _this.labelText = _this.game.add.text(0, 2, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
      _this.labelText.setTextBounds(0, 0, 100, desiredHeight);
      _this.add(_this.labelText);
      if (_modifierType == Modifier.MODIFIER_BUTTON) {
        var gfx = _this.game.add.graphics();
        gfx.beginFill(0x000000, 0.2);
        gfx.drawRect(0, 0, buttonWidth * 1.5, desiredHeight);
        var img = _this.game.add.image(0, 0, gfx.generateTexture());
        _this.addAt(img, 0);
        gfx.destroy();
        img.x = _this.labelText.textBounds.width;
        _this.add(img);
        _this.valueText = _this.game.add.text(0, 2, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        _this.valueText.setTextBounds(img.x, img.y, img.width, img.height);
        _this.add(_this.valueText);
        _this.button = new TWP2.MenuButton(buttonWidth, "center");
        _this.button.setCallback(_this.onSelectClicked, _this, [_data["windowTitle"]]);
        _this.button.setLabelText("Select...");
        _this.button.setIcon(_this.game.add.image(0, 0, "atlas_ui", "icon_arrow"));
        _this.button.x = img.x + img.width;
        _this.add(_this.button);
      } else if (_modifierType == Modifier.MODIFIER_SLIDER) {
        _this.valueText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        _this.valueText.setTextBounds(0, 3, 64, desiredHeight);
        _this.add(_this.valueText);
        _this.slider = new UISlider(_data, _this.onUpdate, _this);
        _this.slider.x = _this.labelText.textBounds.width;
        _this.slider.y = desiredHeight * 0.5 - _this.slider.height * 0.5;
        _this.add(_this.slider);
        _this.valueText.x = _this.slider.x + _this.slider.width;
        var gfx = _this.game.add.graphics();
        gfx.beginFill(0x000000, 0.5);
        gfx.drawRoundedRect(0, 0, _this.valueText.textBounds.width, _this.valueText.textBounds.height, TWP2.GameUtil.RECT_RADIUS);
        var img = _this.game.add.image(0, 0, gfx.generateTexture());
        _this.addAt(img, 0);
        gfx.destroy();
        img.x = _this.valueText.x;
        img.y = _this.valueText.y;
      }
      if (_data["label"]) {
        _this.setLabelText(_data["label"]);
      }
      return _this;
    }
    Modifier.prototype.destroy = function () {
      this.onUpdateCallback = null;
      this.onUpdateCallbackContext = null;
      this.slider = null;
      this.button = null;
      this.valueText = null;
      this.labelText = null;
      this.items = null;
      _super.prototype.destroy.call(this);
    };
    Modifier.prototype.setUpdateCallback = function (_func, _context) {
      this.onUpdateCallback = _func;
      this.onUpdateCallbackContext = _context;
    };
    Modifier.prototype.onUpdate = function (_val) {
      this.valueText.setText(_val * 10 + "%", true);
      if (this.onUpdateCallback) {
        this.onUpdateCallback.apply(this.onUpdateCallbackContext, [Math.round(_val) / 10]);
      }
    };
    Modifier.prototype.setEnabled = function (_bVal) {
      this.bEnabled = _bVal;
      if (_bVal) {
        this.alpha = 1;
        this.ignoreChildInput = false;
      } else {
        this.alpha = 0.2;
        this.ignoreChildInput = true;
      }
    };
    Modifier.prototype.onSelectClicked = function (_titleText) {};
    Modifier.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    Modifier.prototype.setItems = function (_items) {
      this.items = _items;
      if (this.modifierType == Modifier.MODIFIER_BUTTON) {
        this.selectIndex(0);
        this.button.setEnabled(this.items.length > 1);
      }
    };
    Modifier.prototype.selectIndex = function (_index) {
      if (this.items) {
        this.selectedIndex = _index;
        if (_index > this.items.length - 1) {
          return;
        }
        this.valueText.setText(this.items[this.selectedIndex]["label"], true);
      }
    };
    Modifier.prototype.getSelectedIndex = function () {
      return this.selectedIndex;
    };
    Modifier.prototype.getId = function () {
      return this.id;
    };
    Modifier.prototype.getModifierType = function () {
      return this.modifierType;
    };
    Modifier.prototype.getValue = function () {
      if (this.modifierType == Modifier.MODIFIER_BUTTON) {
        if (this.items && this.items.length > 0) {
          return this.items[this.selectedIndex]["value"];
        }
      } else if (this.modifierType == Modifier.MODIFIER_SLIDER) {
        return this.slider.getValue();
      }
      return null;
    };
    Modifier.prototype.getSlider = function () {
      return this.slider;
    };
    Modifier.MODIFIER_BUTTON = "MODIFIER_BUTTON";
    Modifier.MODIFIER_SLIDER = "MODIFIER_SLIDER";
    return Modifier;
  })(Phaser.Group);
  TWP2.Modifier = Modifier;
  var AchievementBubble = /** @class */ (function (_super) {
    __extends(AchievementBubble, _super);
    function AchievementBubble() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.timer = 0;
      return _this;
    }
    AchievementBubble.prototype.destroy = function () {
      TWP2.GameUtil.game.onAchievementHidden();
      this.tween = null;
      this.textTween = null;
      _super.prototype.destroy.call(this);
    };
    AchievementBubble.prototype.setAchievement = function (_id) {
      var bg = this.game.add.graphics();
      bg.beginFill(0x000000, 1);
      bg.drawRoundedRect(0, 0, this.width, this.height, TWP2.GameUtil.RECT_RADIUS);
      this.add(bg);
      var splash = this.game.add.image(0, 0, "splash_2");
      splash.height = bg.height;
      splash.scale.x = splash.scale.y;
      splash.alpha = 0.25;
      splash.x = 10;
      this.add(splash);
      var achievement = TWP2.Achievements.GetById(_id);
      if (achievement) {
        TWP2.SoundManager.PlayUISound("ui_achievement", 0.5);
        var icon = this.game.add.image(0, 0, "atlas_ui", _id);
        icon.anchor.set(0.5, 0.5);
        icon.x = this.width - icon.width * 0.5 - 10;
        icon.y = this.height * 0.5;
        this.add(icon);
        var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
        checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
        checkmark.x = 10;
        checkmark.y = this.height * 0.5 - checkmark.height * 0.5;
        this.add(checkmark);
        var titleText = this.game.add.text(0, 0, "Achievement Unlocked", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_GREEN_STRING });
        titleText.x = this.width * 0.5 - titleText.width * 0.5;
        titleText.y = 4;
        this.add(titleText);
        var container = this.game.add.group();
        var nameText = this.game.add.text(0, 0, achievement["name"], { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        nameText.setTextBounds(0, 0, this.width, 20);
        container.add(nameText);
        var descText = this.game.add.text(0, 0, achievement["desc"], { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        descText.alpha = 0.8;
        descText.setTextBounds(0, 0, this.width, 20);
        descText.y = nameText.y + nameText.textBounds.height;
        container.add(descText);
        container.y = this.height * 0.5 - container.height * 0.5 + titleText.height * 0.2;
        this.add(container);
        var numAchievements = TWP2.Achievements.GetAll().length;
        var numText = this.game.add.text(0, 0, TWP2.PlayerUtil.GetNumAchivementsUnlocked() + " of " + numAchievements + " achievements unlocked", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        numText.alpha = 0.35;
        numText.x = this.width * 0.5 - numText.width * 0.5;
        numText.y = this.height - descText.height;
        this.add(numText);
      }
      //this.textTween = this.game.add.tween(titleText).to({ alpha: 0.5 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
      this.tween = this.game.add.tween(this).from({ alpha: 0, y: this.y + 50 }, 500, Phaser.Easing.Exponential.Out, true);
      this.timer = AchievementBubble.MAX_TIMER;
    };
    AchievementBubble.prototype.update = function () {
      _super.prototype.update.call(this);
      if (this.timer > 0) {
        this.timer--;
      } else if (this.timer == 0) {
        this.tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
        this.tween.onComplete.add(this.destroy, this);
        this.timer = -1;
      }
    };
    Object.defineProperty(AchievementBubble.prototype, "width", {
      get: function () {
        return 300;
      },
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(AchievementBubble.prototype, "height", {
      get: function () {
        return 110;
      },
      enumerable: true,
      configurable: true,
    });
    AchievementBubble.MAX_TIMER = 210;
    return AchievementBubble;
  })(Phaser.Group);
  TWP2.AchievementBubble = AchievementBubble;
  var StarContainer = /** @class */ (function (_super) {
    __extends(StarContainer, _super);
    function StarContainer(_iconId) {
      if (_iconId === void 0) {
        _iconId = "icon_star";
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      for (var i = 0; i < TWP2.GameModeDatabase.RANKED_STARS; i++) {
        var star = _this.game.add.image(0, 0, "atlas_ui", _iconId);
        star.tint = TWP2.ColourUtil.COLOUR_XP;
        star.x = _this.width + (i > 0 ? 2 : 0);
        _this.add(star);
      }
      return _this;
    }
    StarContainer.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    StarContainer.prototype.setStars = function (_val) {
      for (var i = 0; i < this.length; i++) {
        var star = this.getChildAt(i);
        star.alpha = i >= _val ? 0.1 : 1;
      }
    };
    return StarContainer;
  })(Phaser.Group);
  TWP2.StarContainer = StarContainer;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var MenuSmoke = /** @class */ (function (_super) {
    __extends(MenuSmoke, _super);
    function MenuSmoke() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var numSmokes = 20;
      var maxSmokeSpeed = 24;
      var maxSmokeRotationSpeed = 10;
      var bEnabled = true;
      if (bEnabled) {
        for (var i = 0; i < numSmokes; i++) {
          var smoke = _this.game.add.image(0, 0, "smoke");
          smoke.anchor.set(0.5, 0.5);
          smoke.width = smoke.height = TWP2.MathUtil.Random(_this.game.height, _this.game.height * 2);
          smoke.x = i * (_this.game.width / numSmokes);
          smoke.y = _this.game.height * 0.2; //(smoke.height * 0.5);
          smoke.alpha = TWP2.MathUtil.Random(5, 30) * 0.01;
          smoke.rotation = TWP2.MathUtil.RandomAngle();
          smoke.data = {
            speed: TWP2.MathUtil.Random(-maxSmokeSpeed, maxSmokeSpeed) * 0.01,
            rotationSpeed: TWP2.MathUtil.Random(-maxSmokeRotationSpeed, maxSmokeRotationSpeed) * 0.01 * TWP2.MathUtil.TO_RADIANS,
          };
          _this.add(smoke);
        }
      }
      return _this;
    }
    MenuSmoke.prototype.update = function () {
      for (var i = 0; i < this.length; i++) {
        var child = this.getAt(i);
        child.rotation += child.data["rotationSpeed"];
        child.x += child.data["speed"];
        var mult = child.width * 0.49;
        if (child.x > this.game.width + mult) {
          child.x = -mult;
        } else if (child.x < -mult) {
          child.x = this.game.width + mult;
        }
      }
    };
    MenuSmoke.prototype.setTint = function (_val) {
      for (var i = 0; i < this.length; i++) {
        var child = this.getAt(i);
        child.tint = _val;
      }
    };
    return MenuSmoke;
  })(Phaser.Group);
  TWP2.MenuSmoke = MenuSmoke;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var ElementBase = /** @class */ (function (_super) {
    __extends(ElementBase, _super);
    function ElementBase(_showTweenTime) {
      if (_showTweenTime === void 0) {
        _showTweenTime = 400;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.showTweenTime = 400;
      _this.closeTweenTime = 50;
      _this.bDestroyed = false;
      _this.showTweenTime = _showTweenTime;
      _this.inputEnableChildren = true;
      TWP2.GameUtil.game.addUIElement(_this);
      _this.show();
      return _this;
    }
    ElementBase.prototype.destroy = function () {
      this.tween = null;
      this.onShowCallback = null;
      this.onShowCallbackContext = null;
      this.onShowCallbackParameters = null;
      this.onCloseCallback = null;
      this.onCloseCallbackContext = null;
      this.onCloseCallbackParameters = null;
      TWP2.GameUtil.game.removeUIElement(this);
      this.bDestroyed = true;
      _super.prototype.destroy.call(this);
    };
    ElementBase.prototype.setOnShowCallback = function (_func, _funcContext, _parameters) {
      if (_parameters === void 0) {
        _parameters = null;
      }
      this.onShowCallback = _func;
      this.onShowCallbackContext = _funcContext;
      this.onShowCallbackParameters = _parameters;
    };
    ElementBase.prototype.setOnCloseCallback = function (_func, _funcContext, _parameters) {
      if (_parameters === void 0) {
        _parameters = null;
      }
      this.onCloseCallback = _func;
      this.onCloseCallbackContext = _funcContext;
      this.onCloseCallbackParameters = _parameters;
    };
    ElementBase.prototype.show = function () {
      this.alpha = 0;
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = this.game.add.tween(this).to({ alpha: 1 }, this.showTweenTime, Phaser.Easing.Exponential.Out, true);
      this.tween.onComplete.add(this.onShow, this);
    };
    ElementBase.prototype.onShow = function () {
      if (this.onShowCallback) {
        this.onShowCallback.apply(this.onShowCallbackContext, this.onShowCallbackParameters);
      }
    };
    ElementBase.prototype.close = function () {
      this.inputEnableChildren = false;
      this.ignoreChildInput = true;
      if (this.tween) {
        this.tween.stop();
      }
      this.tween = this.game.add.tween(this).to({ alpha: 0 }, this.closeTweenTime, Phaser.Easing.Exponential.Out, true);
      this.tween.onComplete.add(this.onClose, this);
    };
    ElementBase.prototype.onClose = function () {
      if (this.onCloseCallback) {
        this.onCloseCallback.apply(this.onCloseCallbackContext, this.onCloseCallbackParameters);
      }
      this.destroy();
    };
    return ElementBase;
  })(Phaser.Group);
  TWP2.ElementBase = ElementBase;
  var SplashMenu = /** @class */ (function (_super) {
    __extends(SplashMenu, _super);
    function SplashMenu() {
      var _this = _super.call(this, 3000) || this;
      var splash = _this.game.add.image(0, 0, "splash_3");
      splash.anchor.set(0.5, 0.5);
      splash.x = splash.width * 0.5;
      splash.y = splash.height * 0.5;
      _this.add(splash);
      var tween = _this.game.add.tween(splash.scale).to({ x: 1.15, y: 1.15 }, 10000, Phaser.Easing.Exponential.Out, true);
      var tween = _this.game.add.tween(splash).to({ x: splash.x + 8, rotation: TWP2.MathUtil.ToRad(3) }, 5000, Phaser.Easing.Exponential.Out, true);
      //this.add(new BandFilter());
      var smoke = new TWP2.MenuSmoke();
      smoke.y = _this.game.height * 0.5;
      _this.add(smoke);
      _this.add(new TWP2.FXFilter());
      var borders = _this.game.add.graphics();
      var borderSize = 100;
      borders.beginFill(0x000000, 0.5);
      borders.drawRect(0, 0, _this.game.width, borderSize);
      borders.drawRect(0, _this.game.height - borderSize, _this.game.width, borderSize);
      _this.add(borders);
      /*
          this.titleText = this.game.add.text(0, 0, "Tactical Weapon Pack 2", { font: "48px " + FontUtil.FONT, fill: "#FFFFFF" });
          GameUtil.SetTextShadow(this.titleText);
          */
      _this.titleText = _this.game.add.image(0, 0, "logo");
      _this.titleText.x = _this.game.width * 0.5 - _this.titleText.width * 0.5;
      _this.titleText.y = _this.game.height * 0.5 - _this.titleText.height * 0.5;
      _this.add(_this.titleText);
      var copyText = _this.game.add.text(0, 0, "\u00A9 2019 Wilkin Games", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      copyText.alpha = 0.2;
      copyText.x = _this.game.width * 0.5 - copyText.width * 0.5;
      copyText.y = _this.titleText.y + _this.titleText.height - 42;
      _this.add(copyText);
      var timer = _this.game.time.create();
      timer.add(TWP2.GameUtil.IsDebugging() ? 0 : 500, _this.addClickListener, _this);
      timer.start();
      return _this;
    }
    SplashMenu.prototype.destroy = function () {
      this.titleText = null;
      _super.prototype.destroy.call(this);
    };
    SplashMenu.prototype.addClickListener = function () {
      var container = this.game.add.group();
      this.add(container);
      var clickText = this.game.add.text(0, 0, "Click to start", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      TWP2.GameUtil.SetTextShadow(clickText);
      container.add(clickText);
      container.x = this.game.width * 0.5 - container.width * 0.5;
      container.y = this.titleText.y + this.titleText.height + 40;
      var tween = this.game.add.tween(clickText).to({ alpha: 0.2 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
      var tween = this.game.add.tween(container).from({ alpha: 0, y: container.y + 100 }, 500, Phaser.Easing.Exponential.Out, true);
      this.onChildInputDown.addOnce(this.onClicked, this);
    };
    SplashMenu.prototype.onClicked = function () {
      TWP2.SoundManager.PlayUISound("ui_button_click");
      TWP2.SoundManager.PlayUISound("ui_game_start");
      this.close();
    };
    return SplashMenu;
  })(ElementBase);
  TWP2.SplashMenu = SplashMenu;
  var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
      var _this = _super.call(this) || this;
      _this.bAttemptLogin = true;
      _this.bg = _this.game.add.image(0, 0, "splash_1");
      _this.add(_this.bg);
      var tween = _this.game.add.tween(_this.bg).from({ x: -30 }, 5000, Phaser.Easing.Exponential.Out, true, 0, 0, false);
      _this.menuSmoke = new TWP2.MenuSmoke();
      _this.menuSmoke.y = _this.game.height * 0.5;
      _this.add(_this.menuSmoke);
      var fx = new TWP2.FXFilter();
      _this.add(fx);
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.overlay = _this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      _this.add(_this.overlay);
      _this.container = _this.game.add.group();
      _this.add(_this.container);
      return _this;
    }
    MainMenu.prototype.destroy = function () {
      this.container = null;
      this.overlay = null;
      this.bg = null;
      this.menuSmoke = null;
      this.playMenu = null;
      _super.prototype.destroy.call(this);
    };
    MainMenu.prototype.getPlayMenu = function () {
      return this.playMenu;
    };
    MainMenu.prototype.getCurrentMenu = function () {
      return this.currentMenu;
    };
    MainMenu.prototype.refreshMenu = function () {
      if (this.currentMenu == MainMenu.MENU_MAIN) {
        var buttons = this.container.getByName("buttons");
        var settingsButton = buttons.getByName("settingsButton");
        if (settingsButton) {
          if (!TWP2.APIUtil.IsLoggedIn()) {
            settingsButton.setAlertIconVisible();
          } else {
            settingsButton.clearStatusIcon();
          }
        }
      } else if (this.currentMenu == MainMenu.MENU_SETTINGS) {
        this.loadMenu(this.currentMenu);
      }
    };
    MainMenu.prototype.loadMenu = function (_id) {
      this.tweenToMenu(_id);
    };
    MainMenu.prototype.loadMenuContent = function (_id) {
      this.currentMenu = _id;
      this.container.removeAll(true);
      if (this.currentMenu == MainMenu.MENU_MAIN) {
        var linkGroup = this.game.add.group();
        var linkPadding = 14;
        var twpButton = new TWP2.TextButton("Tactical Weapon Pack", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        twpButton.setCallback(TWP2.GameUtil.OpenTWPDownload, TWP2.GameUtil);
        linkGroup.add(twpButton);
        var awpButton = new TWP2.TextButton("Adversity Weapon Pack", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        awpButton.setCallback(TWP2.GameUtil.OpenAWPDownload, TWP2.GameUtil);
        awpButton.y = linkGroup.height - linkPadding;
        linkGroup.add(awpButton);
        var xwilkinxButton = new TWP2.TextButton("Wilkin Games", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        xwilkinxButton.setCallback(TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_ARMOR_GAMES ? TWP2.GameUtil.OpenWilkinAG : TWP2.GameUtil.OpenWilkinHomepage, TWP2.GameUtil);
        xwilkinxButton.y = linkGroup.height - linkPadding;
        linkGroup.add(xwilkinxButton);
        if (TWP2.APIUtil.ShouldShowSponsor()) {
          var likeButton = new TWP2.TextButton("Like Us!", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          likeButton.setCallback(TWP2.GameUtil.OpenAGFacebook, TWP2.GameUtil);
          likeButton.y = linkGroup.height - linkPadding;
          linkGroup.add(likeButton);
        }
        linkGroup.x = 4;
        linkGroup.y = 4;
        this.container.add(linkGroup);
        var titleLogo = this.game.add.image(0, 0, "logo");
        titleLogo.x = this.game.width * 0.5 - titleLogo.width * 0.5;
        titleLogo.y = 24;
        this.container.add(titleLogo);
        if (TWP2.APIUtil.ShouldShowSponsor()) {
          var sponsorLogo = new TWP2.ImageButton("sponsor_ag_small");
          sponsorLogo.setCallback(TWP2.GameUtil.OpenAGHomepage, TWP2.GameUtil);
          sponsorLogo.x = this.game.width * 0.5 - sponsorLogo.width * 0.5;
          sponsorLogo.y = 10;
          this.container.add(sponsorLogo);
        }
        var versionInfo = this.game.add.text(0, 0, TWP2.GameUtil.GetVersionNumber(), { font: "12px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF" });
        versionInfo.alpha = 0.2;
        versionInfo.x = this.game.width * 0.5 - versionInfo.width * 0.5;
        versionInfo.y = titleLogo.y + titleLogo.height - 50;
        this.container.add(versionInfo);
        var toggler = new TWP2.VolumeToggler();
        toggler.x = this.game.width - toggler.width - 4;
        toggler.y = 4;
        this.container.add(toggler);
        var socialGroup = TWP2.GameUtil.CreateSocialGroup();
        socialGroup.x = this.game.width * 0.5 - socialGroup.width * 0.5;
        socialGroup.y = this.game.height - socialGroup.height - 4;
        this.container.add(socialGroup);
        var buttons = this.game.add.group();
        buttons.name = "buttons";
        var playButton = new TWP2.SplashButton();
        playButton.setIcon("atlas_ui", "icon_profile");
        playButton.setLabelText("Ranked");
        playButton.setCallback(this.loadMenu, this, [MainMenu.MENU_PLAY]);
        if (TWP2.PlayerUtil.IsPendingNewItems()) {
          //playButton.setNewIconVisible();
        }
        buttons.add(playButton);
        var rangeButton = new TWP2.SplashButton();
        rangeButton.setIcon("atlas_weapons_icons_small", TWP2.WeaponDatabase.WEAPON_AK47);
        rangeButton.setLabelText("Firing Range");
        rangeButton.x = buttons.width + 4;
        rangeButton.setCallback(TWP2.GameUtil.game.prepareGame, TWP2.GameUtil.game, [{ gameMode: TWP2.GameModeDatabase.GAME_RANGE }]);
        buttons.add(rangeButton);
        var settingsButton = new TWP2.SplashButton();
        settingsButton.setIcon("atlas_ui", "icon_settings_large");
        settingsButton.name = "settingsButton";
        settingsButton.setLabelText("Settings");
        settingsButton.x = buttons.width + 4;
        settingsButton.setCallback(this.loadMenu, this, [MainMenu.MENU_SETTINGS]);
        if (TWP2.APIUtil.CurrentAPI && !TWP2.APIUtil.IsLoggedIn()) {
          settingsButton.setAlertIconVisible();
        }
        buttons.add(settingsButton);
        var downloadButton = new TWP2.SplashButton(TWP2.ColourUtil.COLOUR_GREEN);
        downloadButton.setIcon("atlas_ui", "icon_download");
        downloadButton.setLabelText("Download");
        downloadButton.x = buttons.width + 4;
        downloadButton.setCallback(TWP2.GameUtil.game.createWindow, TWP2.GameUtil.game, [
          {
            titleText: "Download",
            icon: "icon_download",
            iconTint: TWP2.ColourUtil.COLOUR_XP,
            type: TWP2.Window.TYPE_DOWNLOAD,
            messageText: "Are you a developer, artist, or animator?\n\nAll content in Tactical Weapon Pack 2 is free to use in your own projects!",
          },
        ]);
        buttons.add(downloadButton);
        var ds3Button = new TWP2.SplashButton(TWP2.ColourUtil.COLOUR_GREEN);
        ds3Button.setIcon("atlas_ui", "ds3");
        ds3Button.setLabelText("Play Deadswitch 3");
        ds3Button.x = buttons.width + 4;
        ds3Button.setCallback(function () {
          TWP2.GameUtil.OpenDeadswitch3();
        }, null);
        buttons.add(ds3Button);
        buttons.x = this.game.width * 0.5 - buttons.width * 0.5;
        buttons.y = this.game.height * 0.5 - buttons.height * 0.5 + 10;
        this.container.add(buttons);
        var descText = this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
        descText.setTextBounds(0, 0, buttons.width, 20);
        descText.x = buttons.x;
        descText.y = buttons.y + buttons.height + 40;
        this.container.add(descText);
        playButton.events.onInputOver.add(TWP2.GameUtil.OnOverSetText, TWP2.GameUtil, 0, descText, "Earn XP and money by playing game modes.");
        playButton.events.onInputOut.add(TWP2.GameUtil.OnOutClearText, TWP2.GameUtil, 0, descText);
        rangeButton.events.onInputOver.add(TWP2.GameUtil.OnOverSetText, TWP2.GameUtil, 0, descText, "Test weapons and equipment in the firing range.");
        rangeButton.events.onInputOut.add(TWP2.GameUtil.OnOutClearText, TWP2.GameUtil, 0, descText);
        settingsButton.events.onInputOver.add(TWP2.GameUtil.OnOverSetText, TWP2.GameUtil, 0, descText, "Manage game settings.");
        settingsButton.events.onInputOut.add(TWP2.GameUtil.OnOutClearText, TWP2.GameUtil, 0, descText);
        downloadButton.events.onInputOver.add(TWP2.GameUtil.OnOverSetText, TWP2.GameUtil, 0, descText, "Download the Tactical Weapon Pack 2 assets.");
        downloadButton.events.onInputOut.add(TWP2.GameUtil.OnOutClearText, TWP2.GameUtil, 0, descText);
        ds3Button.events.onInputOver.add(TWP2.GameUtil.OnOverSetText, TWP2.GameUtil, 0, descText, "Play Deadswitch 3, built with Tactical Weapon Pack 2.");
        ds3Button.events.onInputOut.add(TWP2.GameUtil.OnOutClearText, TWP2.GameUtil, 0, descText);
        if (this.bAttemptLogin) {
          this.bAttemptLogin = false;
          if (TWP2.APIUtil.CurrentAPI == TWP2.APIUtil.API_NEWGROUNDS) {
            TWP2.APIUtil.ValidateSession(true);
            if (TWP2.APIUtil.IsLoggedIn()) {
              TWP2.APIUtil.OnLoggedIn();
            }
          }
        }
      } else {
        if (this.currentMenu == MainMenu.MENU_PLAY) {
          if (this.playMenu) {
            this.playMenu.destroy();
          }
          this.playMenu = new TWP2.PlayMenu();
          this.container.add(this.playMenu);
          if (TWP2.PlayerUtil.player["bNewPlayer"] == true) {
            TWP2.PlayerUtil.player["bNewPlayer"] = false;
            TWP2.GameUtil.game.createWindow({
              type: TWP2.Window.TYPE_WELCOME,
              titleText: "Welcome",
              messageText: "Welcome to Tactical Weapon Pack 2!",
              bShowOkayButton: true,
            });
            //GameUtil.game.savePlayerData();
          }
        } else if (this.currentMenu == MainMenu.MENU_SETTINGS) {
          var backButton = new TWP2.BasicButton("icon_back");
          backButton.setCallback(this.loadMenu, this, [MainMenu.MENU_MAIN]);
          backButton.x = 4;
          backButton.y = 4;
          this.container.add(backButton);
          var settingsText = this.game.add.text(0, 0, "Settings", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          settingsText.x = backButton.x + backButton.width + 10;
          settingsText.y = backButton.y + backButton.height * 0.5 - settingsText.height * 0.5 + 2;
          this.container.add(settingsText);
          var audioText = this.game.add.text(0, 0, "Audio", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          audioText.x = 10;
          audioText.y = settingsText.y + settingsText.height + 40;
          this.container.add(audioText);
          var gameVolume = new TWP2.Modifier("gameVolume", TWP2.Modifier.MODIFIER_SLIDER, {
            label: "Game Volume",
            w: this.game.width * 0.5,
            min: 0,
            max: 10,
            increment: 1,
            value: TWP2.PlayerUtil.player.settings["gameVolume"] * 10,
          });
          gameVolume.setUpdateCallback(TWP2.PlayerUtil.SetGameVolume, TWP2.PlayerUtil);
          gameVolume.x = audioText.x + 10;
          gameVolume.y = audioText.y + audioText.height;
          this.container.add(gameVolume);
          var musicVolume = new TWP2.Modifier("gameVolume", TWP2.Modifier.MODIFIER_SLIDER, {
            label: "Music Volume",
            w: this.game.width * 0.5,
            min: 0,
            max: 10,
            increment: 1,
            value: TWP2.PlayerUtil.player.settings["musicVolume"] * 10,
          });
          musicVolume.setUpdateCallback(TWP2.PlayerUtil.SetMusicVolume, TWP2.PlayerUtil);
          musicVolume.x = audioText.x + 10;
          musicVolume.y = gameVolume.y + gameVolume.height + 4;
          this.container.add(musicVolume);
          this.container.add(TWP2.GameUtil.CreateTree([audioText, gameVolume, musicVolume]));
          var controlsText = this.game.add.text(0, 0, "Controls", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          controlsText.x = 10;
          controlsText.y = this.container.height + 20;
          this.container.add(controlsText);
          var changeControlsButton = new TWP2.MenuButton(undefined, "left");
          changeControlsButton.setCallback(TWP2.GameUtil.game.createWindow, TWP2.GameUtil.game, [
            {
              type: TWP2.Window.TYPE_CONTROLS,
              titleText: "Controls",
              messageText: "View or modify game controls.",
            },
          ]);
          changeControlsButton.setLabelText("Change Controls");
          changeControlsButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_controls"));
          changeControlsButton.x = controlsText.x + 10;
          changeControlsButton.y = this.container.height + 4;
          this.container.add(changeControlsButton);
          this.container.add(TWP2.GameUtil.CreateTree([controlsText, changeControlsButton]));
          var graphicsText = this.game.add.text(0, 0, "Gameplay", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          graphicsText.x = 10;
          graphicsText.y = this.container.height + 20;
          this.container.add(graphicsText);
          var effectsButton = new TWP2.MenuButton(undefined, "left");
          effectsButton.setToggle(true);
          effectsButton.setSelected(TWP2.PlayerUtil.player.settings["bEffects"]);
          effectsButton.setCallback(TWP2.PlayerUtil.ToggleSetting, TWP2.PlayerUtil, ["bEffects", effectsButton]);
          effectsButton.setLabelText("Effects");
          effectsButton.x = graphicsText.x + 10;
          effectsButton.y = this.container.height + 6;
          this.container.add(effectsButton);
          var shellsButton = new TWP2.MenuButton(undefined, "left");
          shellsButton.setToggle(true);
          shellsButton.setSelected(TWP2.PlayerUtil.player.settings["bShells"]);
          shellsButton.setCallback(TWP2.PlayerUtil.ToggleSetting, TWP2.PlayerUtil, ["bShells", shellsButton]);
          shellsButton.setLabelText("Shells");
          shellsButton.x = graphicsText.x + 10;
          shellsButton.y = this.container.height + 10;
          this.container.add(shellsButton);
          var magsButton = new TWP2.MenuButton(undefined, "left");
          magsButton.setToggle(true);
          magsButton.setSelected(TWP2.PlayerUtil.player.settings["bMags"]);
          magsButton.setCallback(TWP2.PlayerUtil.ToggleSetting, TWP2.PlayerUtil, ["bMags", magsButton]);
          magsButton.setLabelText("Mags");
          magsButton.x = graphicsText.x + 10;
          magsButton.y = this.container.height + 10;
          this.container.add(magsButton);
          this.container.add(TWP2.GameUtil.CreateTree([graphicsText, effectsButton, shellsButton, magsButton]));
          if (TWP2.APIUtil.CurrentAPI) {
            var apiText = this.game.add.text(0, 0, TWP2.APIUtil.GetCurrentAPIName(), { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
            apiText.x = 10;
            apiText.y = this.container.height + 20;
            this.container.add(apiText);
            var icon = this.game.add.image(0, 0, "atlas_ui", "icon_" + TWP2.APIUtil.GetCurrentAPIId());
            icon.x = 20;
            icon.y = this.container.height + 10;
            this.container.add(icon);
            if (TWP2.APIUtil.IsLoggedIn()) {
              var usernameText = this.game.add.text(0, 0, TWP2.APIUtil.GetUserName(), { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
              usernameText.x = icon.x + icon.width + 10;
              usernameText.y = icon.y + icon.height * 0.5 - usernameText.height * 0.5 - 6;
              this.container.add(usernameText);
              var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
              checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
              checkmark.x = usernameText.x;
              checkmark.y = usernameText.y + usernameText.height - 8;
              this.container.add(checkmark);
              var connectedText = this.game.add.text(0, 0, "Connected", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
              connectedText.x = checkmark.x + checkmark.width + 2;
              connectedText.y = checkmark.y + checkmark.height * 0.5 - connectedText.height * 0.5 + 2;
              this.container.add(connectedText);
              if (TWP2.GameUtil.IsDebugging()) {
                var logoutButton = new TWP2.MenuButton(undefined, undefined, TWP2.ColourUtil.COLOUR_RED);
                logoutButton.setCallback(TWP2.APIUtil.Logout, TWP2.APIUtil);
                logoutButton.setLabelText("Disconnect");
                logoutButton.x = connectedText.x + connectedText.width + 20;
                logoutButton.y = icon.y + icon.height * 0.5 - logoutButton.height * 0.5;
                this.container.add(logoutButton);
              }
            } else {
              var errorIcon = this.game.add.image(0, 0, "atlas_ui", "icon_alert");
              errorIcon.tint = TWP2.ColourUtil.COLOUR_XP;
              errorIcon.x = icon.x + icon.width + 10;
              errorIcon.y = icon.y + icon.height * 0.5 - errorIcon.height * 0.5;
              this.container.add(errorIcon);
              var connectedText = this.game.add.text(0, 0, "Not connected", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
              connectedText.x = errorIcon.x + errorIcon.width + 4;
              connectedText.y = icon.y + icon.height * 0.5 - connectedText.height * 0.5 + 2;
              this.container.add(connectedText);
              var loginButton = new TWP2.MenuButton();
              loginButton.setLabelText("Connect");
              loginButton.setCallback(TWP2.APIUtil.ShowSignInWindow, TWP2.APIUtil);
              loginButton.x = connectedText.x + connectedText.width + 20;
              loginButton.y = icon.y + icon.height * 0.5 - loginButton.height * 0.5;
              this.container.add(loginButton);
            }
            var infoText = this.game.add.text(0, 0, "Stay connected to submit your score and unlock achievements!", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
            infoText.alpha = 0.35;
            infoText.x = 10;
            infoText.y = this.container.height + 10;
            this.container.add(infoText);
          }
          var deleteButton = new TWP2.MenuButton(100, undefined, TWP2.ColourUtil.COLOUR_RED, 50);
          deleteButton.setLabelText("Delete Data");
          deleteButton.setCallback(TWP2.GameUtil.game.createWindow, TWP2.GameUtil.game, [
            {
              titleText: "Delete Data",
              type: TWP2.Window.TYPE_YES_NO,
              messageText: "Are you sure you want to delete all game data? This cannot be undone.",
              yesCallback: TWP2.PlayerUtil.ResetData,
              yesCallbackContext: TWP2.PlayerUtil,
              yesCallbackParams: null,
            },
          ]);
          deleteButton.x = this.game.width - deleteButton.width - 4;
          deleteButton.y = 4;
          this.container.add(deleteButton);
          if (TWP2.GameUtil.IsDebugging()) {
            var cheatButton = new TWP2.MenuButton(deleteButton.width, undefined, TWP2.ColourUtil.COLOUR_GREEN, deleteButton.height);
            cheatButton.setLabelText("Cheat");
            cheatButton.setCallback(TWP2.PlayerUtil.QuickCheat, TWP2.PlayerUtil);
            cheatButton.x = deleteButton.x - cheatButton.width - 4;
            cheatButton.y = deleteButton.y;
            this.container.add(cheatButton);
          }
        }
      }
      var tween = this.game.add.tween(this.container).to({ alpha: 1 }, 200, Phaser.Easing.Exponential.Out, true);
    };
    MainMenu.prototype.tweenToMenu = function (_id) {
      if (!this.currentMenu) {
        this.loadMenuContent(_id);
      } else {
        this.container.ignoreChildInput = true;
        var tween = this.game.add.tween(this.container).to({ alpha: 0 }, 100, Phaser.Easing.Exponential.Out, true, 0);
        tween.onComplete.addOnce(this.onTweenComplete, this, 0, _id);
      }
    };
    MainMenu.prototype.onTweenComplete = function (_param1, _param2, _id) {
      this.loadMenuContent(_id);
      this.container.ignoreChildInput = false;
    };
    MainMenu.MENU_MAIN = "MENU_MAIN";
    MainMenu.MENU_PLAY = "MENU_PLAY";
    MainMenu.MENU_SETTINGS = "MENU_SETTINGS";
    return MainMenu;
  })(ElementBase);
  TWP2.MainMenu = MainMenu;
  var PreGameMenu = /** @class */ (function (_super) {
    __extends(PreGameMenu, _super);
    function PreGameMenu(_data) {
      var _this = _super.call(this) || this;
      _this.data = _data;
      var gameMode = TWP2.GameModeDatabase.GetGameMode(_data["gameMode"]);
      var splash = _this.game.add.image(0, 0, "splash_2");
      _this.add(splash);
      var tween = _this.game.add.tween(splash).from({ x: 30 }, 5000, Phaser.Easing.Exponential.Out, true, 0, 0, false);
      var menuSmoke = new TWP2.MenuSmoke();
      menuSmoke.y = _this.game.height * 0.5;
      _this.add(menuSmoke);
      _this.add(new TWP2.FXFilter());
      _this.container = _this.game.add.group();
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.1);
      gfx.drawRoundedRect(0, 0, _this.game.width * 0.8, gameMode["id"] != TWP2.GameModeDatabase.GAME_RANGE ? 420 : 300, TWP2.GameUtil.RECT_RADIUS);
      _this.container.add(gfx);
      var gameIcon = _this.game.add.image(0, 0, "atlas_ui", gameMode["id"]);
      //gameIcon.scale.set(0.5, 0.5);
      gameIcon.x = _this.container.width * 0.5 - gameIcon.width * 0.5;
      gameIcon.y = 20;
      _this.container.add(gameIcon);
      var titleText = _this.game.add.text(0, 0, gameMode["name"], { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      TWP2.GameUtil.SetTextShadow(titleText);
      titleText.x = _this.container.width * 0.5 - titleText.width * 0.5;
      titleText.y = gameIcon.y + gameIcon.height + 10;
      _this.container.add(titleText);
      var descText = _this.game.add.text(0, 0, gameMode["desc"], { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(descText);
      descText.alpha = 0.8;
      descText.x = _this.container.width * 0.5 - descText.width * 0.5;
      descText.y = titleText.y + titleText.height;
      _this.container.add(descText);
      if (gameMode["id"] != TWP2.GameModeDatabase.GAME_RANGE) {
        var scoreContainer = _this.game.add.group();
        var bestScoreText = _this.game.add.text(0, 0, "Personal Best:", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        bestScoreText.alpha = 0.5;
        bestScoreText.setTextBounds(0, 0, 160, 30);
        scoreContainer.add(bestScoreText);
        var playerScore = TWP2.PlayerUtil.player.bestScores[gameMode["id"]];
        var scoreText = _this.game.add.text(0, 0, playerScore, { font: "32px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        TWP2.GameUtil.SetTextShadow(scoreText);
        scoreText.setTextBounds(0, 0, 160, 30);
        scoreText.y = bestScoreText.y + bestScoreText.height;
        scoreContainer.add(scoreText);
        var starContainer = new TWP2.StarContainer();
        var numStars = TWP2.GameModeDatabase.GetStarsForGameMode(gameMode["id"], playerScore);
        starContainer.setStars(numStars);
        starContainer.x = bestScoreText.textBounds.halfWidth - starContainer.width * 0.5;
        starContainer.y = scoreText.y + scoreText.height + 4;
        scoreContainer.add(starContainer);
        scoreContainer.x = _this.container.width * 0.5 - 80;
        scoreContainer.y = descText.y + descText.height + 30;
        _this.container.add(scoreContainer);
      }
      _this.spinner = TWP2.GameUtil.CreateSpinner();
      _this.spinner.x = _this.container.width * 0.5;
      _this.spinner.y = _this.container.height - _this.spinner.height * 0.5 - 10;
      _this.container.add(_this.spinner);
      _this.tipText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.tipText.alpha = 0.5;
      _this.tipText.setTextBounds(0, 0, _this.container.width, 20);
      _this.tipText.y = _this.spinner.y - _this.tipText.height - 30;
      _this.container.add(_this.tipText);
      _this.add(_this.container);
      _this.container.x = _this.game.width * 0.5 - _this.container.width * 0.5;
      _this.container.y = _this.game.height * 0.5 - _this.container.height * 0.5;
      var timer = _this.game.time.create();
      timer.add(TWP2.GameUtil.IsDebugging() ? 500 : TWP2.GameUtil.AdsEnabled() ? 4000 : 500, _this.onGameReady, _this);
      timer.start();
      _this.setRandomTip();
      var keys = _this.createKeyInfo();
      keys.x = 10;
      keys.y = 10;
      _this.container.add(keys);
      TWP2.SoundManager.PlayUISound("ui_game_prepare", 0.5);
      /* Manage ads */
      var maxGames = 3;
      console.log("APIUtil.GameCount: " + TWP2.APIUtil.GameCount);
      if (TWP2.APIUtil.GameCount == 1) {
        console.log("Game count reached, play ad...");
        if (TWP2.GameUtil.ShouldUseCPMStarAds()) {
          var adTimer = _this.game.time.create();
          adTimer.add(500, TWP2.AdUtil.ShowAd, TWP2.AdUtil);
          adTimer.start();
        } else {
          TWP2.AdUtil.ShowAd();
        }
      } else {
        if (TWP2.APIUtil.CurrentAPI != TWP2.APIUtil.API_ARMOR_GAMES) {
          if (TWP2.MathUtil.Random(1, 8) == 1) {
            TWP2.AdUtil.ShowAnchorAd();
          }
        }
      }
      TWP2.APIUtil.GameCount++;
      if (TWP2.APIUtil.GameCount >= maxGames) {
        TWP2.APIUtil.GameCount = 1;
      }
      return _this;
    }
    PreGameMenu.prototype.destroy = function () {
      this.data = null;
      this.spinner = null;
      this.container = null;
      this.tipText = null;
      if (this.tipTimer) {
        this.tipTimer.stop();
      }
      this.tipTimer = null;
      _super.prototype.destroy.call(this);
    };
    PreGameMenu.prototype.setRandomTip = function () {
      if (this.tipText) {
        this.tipText.setText(TWP2.GameUtil.GetRandomTip(), true);
        if (this.tipTimer) {
          this.tipTimer.stop();
        }
        this.tipTimer = this.game.time.create();
        this.tipTimer.add(5000, this.setRandomTip, this);
        this.tipTimer.start();
      }
    };
    PreGameMenu.prototype.createKeyInfo = function () {
      var padding = 4;
      var group = this.game.add.group();
      var pauseKey = new TWP2.KeyDetail(Phaser.Keyboard.ESC, "Pause menu", TWP2.KeyDetail.STYLE_DEFAULT);
      group.add(pauseKey);
      var reloadKey = new TWP2.KeyDetail(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_RELOAD], "Reload", TWP2.KeyDetail.STYLE_DEFAULT);
      reloadKey.y = group.height + padding;
      group.add(reloadKey);
      if (this.data["gameMode"] == TWP2.GameModeDatabase.GAME_RANGE) {
        var switchKey = new TWP2.KeyDetail(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_ACTION], "Create target", TWP2.KeyDetail.STYLE_DEFAULT);
        switchKey.y = group.height + padding;
        group.add(switchKey);
      } else {
        var switchKey = new TWP2.KeyDetail(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_SWITCH_WEAPON], "Switch weapon", TWP2.KeyDetail.STYLE_DEFAULT);
        switchKey.y = group.height + padding;
        group.add(switchKey);
        var barrelKey = new TWP2.KeyDetail(TWP2.PlayerUtil.GetControlsData()[TWP2.PlayerUtil.CONTROL_BARREL], "Use barrel attachment", TWP2.KeyDetail.STYLE_DEFAULT);
        barrelKey.y = group.height + padding;
        group.add(barrelKey);
      }
      return group;
    };
    PreGameMenu.prototype.onGameReady = function () {
      var startText = this.game.add.text(0, 0, "Click to start", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      TWP2.GameUtil.SetTextShadow(startText);
      startText.alpha = 0.2;
      startText.x = this.container.width * 0.5 - startText.width * 0.5;
      startText.y = this.container.height - startText.height - 10;
      this.container.add(startText);
      var tween = this.game.add.tween(startText).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
      this.spinner.destroy();
      this.spinner = null;
      this.onChildInputDown.addOnce(this.onClicked, this);
    };
    PreGameMenu.prototype.onClicked = function () {
      TWP2.SoundManager.PlayUISound("ui_button_click");
      this.setOnCloseCallback(TWP2.GameUtil.game.startGameState, TWP2.GameUtil.game, [this.data]);
      this.close();
    };
    return PreGameMenu;
  })(ElementBase);
  TWP2.PreGameMenu = PreGameMenu;
  var MenuBase = /** @class */ (function (_super) {
    __extends(MenuBase, _super);
    function MenuBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    MenuBase.prototype.show = function () {
      _super.prototype.show.call(this);
      TWP2.GameUtil.GetGameState().setWorldBlur(true);
      TWP2.GameUtil.GetGameState().getPlayerController().getHUD().hide();
    };
    MenuBase.prototype.close = function () {
      _super.prototype.close.call(this);
      TWP2.GameUtil.GetGameState().setWorldBlur(false);
      TWP2.GameUtil.GetGameState().getPlayerController().getHUD().show();
    };
    return MenuBase;
  })(ElementBase);
  TWP2.MenuBase = MenuBase;
  var ClassSelectorMenu = /** @class */ (function (_super) {
    __extends(ClassSelectorMenu, _super);
    function ClassSelectorMenu() {
      var _this = _super.call(this) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.2);
      gfx.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.add(gfx);
      var splash = _this.game.add.image(_this.game.width * 0.5, _this.game.height * 0.5, "splash_3");
      splash.anchor.set(0.5, 0.5);
      splash.alpha = 0.35;
      _this.add(splash);
      var tween = _this.game.add.tween(splash.scale).to({ x: 1.1, y: 1.1 }, 3000, Phaser.Easing.Exponential.Out, true);
      var container = _this.game.add.group();
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.8);
      bg.drawRect(0, 0, _this.game.width, 420);
      container.add(bg);
      var titleText = _this.game.add.text(0, 0, "Select Loadout", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(titleText);
      titleText.x = container.width * 0.5 - titleText.width * 0.5;
      titleText.y = 10;
      container.add(titleText);
      var infoText = _this.game.add.text(0, 0, "You can customize your loadouts in the loadouts menu.", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      infoText.alpha = 0.5;
      infoText.x = container.width * 0.5 - infoText.width * 0.5;
      infoText.y = titleText.y + titleText.height;
      container.add(infoText);
      var loadouts = TWP2.PlayerUtil.player.loadouts;
      var loadoutContainer = _this.game.add.group();
      _this.buttons = [];
      for (var i = 0; i < loadouts.length; i++) {
        var but = new TWP2.SelectLoadoutButton();
        but.setCallback(_this.onClassClicked, _this, [i]);
        but.setLoadout(loadouts[i]);
        but.x = loadoutContainer.width + (i > 0 ? 8 : 0);
        loadoutContainer.add(but);
        _this.buttons.push(but);
      }
      loadoutContainer.x = container.width * 0.5 - loadoutContainer.width * 0.5;
      loadoutContainer.y = infoText.y + infoText.height + 20;
      container.add(loadoutContainer);
      container.x = _this.width * 0.5 - container.width * 0.5;
      container.y = _this.height * 0.5 - container.height * 0.5;
      _this.add(container);
      return _this;
    }
    ClassSelectorMenu.prototype.destroy = function () {
      this.buttons = null;
      _super.prototype.destroy.call(this);
    };
    ClassSelectorMenu.prototype.onClassClicked = function (_index) {
      this.animateSelection(_index);
    };
    ClassSelectorMenu.prototype.animateSelection = function (_index) {
      TWP2.SoundManager.PlayUISound("ui_unlock_item", 1);
      for (var i = 0; i < this.buttons.length; i++) {
        var but = this.buttons[i];
        but.setCallback(null, null);
        if (i != _index) {
          var tween = this.game.add.tween(but).to({ alpha: 0 }, 300, Phaser.Easing.Exponential.Out, true);
        } else {
          but.showCheckmark();
        }
      }
      var timer = this.game.time.create();
      timer.add(300, this.equipAndClose, this, _index);
      timer.start();
    };
    ClassSelectorMenu.prototype.equipAndClose = function (_index) {
      this.close();
      var classData = TWP2.PlayerUtil.player.loadouts[_index];
      if (classData) {
        var char = TWP2.GameUtil.GetGameState().createPlayerCharacter(TWP2.GameUtil.GetGameState().getGameMode().getPlayerSpawnY());
        var primaryWeapon = TWP2.WeaponDatabase.GetWeapon(classData["primary"]["id"]);
        this.applyWeaponModifiers(primaryWeapon, classData["primary"]["mods"]);
        char.addInventoryItem(primaryWeapon);
        var secondaryWeapon = TWP2.WeaponDatabase.GetWeapon(classData["secondary"]["id"]);
        this.applyWeaponModifiers(secondaryWeapon, classData["secondary"]["mods"]);
        char.addInventoryItem(secondaryWeapon);
      }
      TWP2.GameUtil.GetGameState().getGameMode().prepareGame();
    };
    ClassSelectorMenu.prototype.applyWeaponModifiers = function (_weaponData, _modData) {
      TWP2.WeaponDatabase.ApplyWeaponMods(_weaponData, _modData);
    };
    return ClassSelectorMenu;
  })(MenuBase);
  TWP2.ClassSelectorMenu = ClassSelectorMenu;
  var GameOverMenu = /** @class */ (function (_super) {
    __extends(GameOverMenu, _super);
    function GameOverMenu() {
      var _this = _super.call(this) || this;
      _this.score = 0;
      _this.bNewBestScore = false;
      _this.totalKills = 0;
      _this.accuracy = 0;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.35);
      gfx.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.add(gfx);
      var splash = _this.game.add.image(_this.game.width * 0.5, _this.game.height * 0.5, "splash_2");
      splash.anchor.set(0.5, 0.5);
      splash.alpha = 0.5;
      _this.add(splash);
      var tween = _this.game.add.tween(splash).from({ alpha: 0 }, 3000, Phaser.Easing.Exponential.Out, true, 500);
      var tween = _this.game.add.tween(splash.scale).to({ x: 1.2, y: 1.2 }, 3000, Phaser.Easing.Exponential.Out, true, 500);
      var timer = _this.game.time.create();
      timer.add(200, _this.showWindow, _this);
      timer.start();
      var modeData = TWP2.GameModeDatabase.GetGameMode(TWP2.GameUtil.GetGameState().getData()["gameMode"]);
      var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
      var time = -1;
      if (!gameMode.isTimeLimited()) {
        time = gameMode.getTime();
      }
      _this.totalKills = gameMode.getKills();
      var accuracy = gameMode.getAccuracy();
      var headshotMult = 1;
      var accuracyMult = 1;
      if (gameMode["id"] == TWP2.GameModeDatabase.GAME_SNIPER) {
        headshotMult = 2;
        accuracyMult = 2;
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_REFLEX) {
        headshotMult = 3;
        accuracyMult = 2;
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_SHOOTER) {
        headshotMult = 2;
        accuracyMult = 2;
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_WAR) {
        headshotMult = 2;
      }
      var score = gameMode.getKills();
      score += gameMode.getHeadshots() * headshotMult;
      if (time >= 0) {
        var timeMax = 3600;
        score += 50 * Math.max(1, 1 - time / timeMax);
      }
      score *= accuracyMult + accuracy;
      if (gameMode["id"] == TWP2.GameModeDatabase.GAME_SNIPER) {
        score *= 1 * accuracy;
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_REFLEX) {
        score *= 1 + accuracy;
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_HARDENED) {
        score *= 1 + accuracy * 0.5;
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_SHOOTER) {
        var shooter = gameMode;
        score += 100 * Math.min(0, 1 - shooter.getTargetsMissed() * 0.02);
        if (shooter.getTargetsMissed() == 0) {
          score += 50;
        }
      } else if (gameMode["id"] == TWP2.GameModeDatabase.GAME_REFLEX) {
        var reflex = gameMode;
        score += 200 * Math.min(0, 1 - reflex.getTargetsMissed() * 0.01);
        if (reflex.getTargetsMissed() == 0) {
          score += 100;
        }
      }
      if (_this.totalKills == 0) {
        score = 0;
      }
      _this.score = Math.round(score);
      var lastBestScore = TWP2.PlayerUtil.player["bestScores"][gameMode["id"]];
      _this.bNewBestScore = _this.score > lastBestScore;
      if (_this.bNewBestScore) {
        TWP2.PlayerUtil.player["bestScores"][gameMode["id"]] = _this.score;
      }
      TWP2.PlayerUtil.CheckExpert();
      return _this;
    }
    GameOverMenu.prototype.destroy = function () {
      this.leaderboards = null;
      this.leaderboardsContainer = null;
      this.banner = null;
      this.restartButton = null;
      this.quitButton = null;
      _super.prototype.destroy.call(this);
    };
    Object.defineProperty(GameOverMenu.prototype, "width", {
      get: function () {
        return this.game.width;
      },
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(GameOverMenu.prototype, "height", {
      get: function () {
        return this.game.height;
      },
      enumerable: true,
      configurable: true,
    });
    GameOverMenu.prototype.showWindow = function () {
      var gfx = this.game.add.graphics();
      gfx.beginFill(0x000000, 0.8);
      gfx.drawRect(0, 0, this.width, 1);
      this.banner = this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.banner.anchor.set(0.5, 0.5);
      this.banner.x = this.width * 0.5;
      this.banner.y = this.height * 0.5 - this.banner.height * 0.5;
      this.add(this.banner);
      var tween = this.setBannerHeight(280);
      tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_init");
    };
    GameOverMenu.prototype.onStarShow = function () {
      TWP2.SoundManager.PlayUISound("ui_star");
    };
    GameOverMenu.prototype.onStarMissed = function () {
      TWP2.SoundManager.PlayUISound("ui_error");
    };
    GameOverMenu.prototype.onTweenComplete = function (_param1, _param2, _id) {
      if (_id == "tween_init") {
        var scoreContainer = this.game.add.group();
        scoreContainer.name = "scoreContainer";
        var scoreText = this.game.add.text(0, 0, "Total Score:", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        scoreContainer.add(scoreText);
        var valueText = this.game.add.text(0, 0, TWP2.GameUtil.FormatNum(this.score), { font: "48px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        TWP2.GameUtil.SetTextShadow(valueText);
        valueText.x = scoreText.x + scoreText.width + 12;
        valueText.y = scoreText.y;
        scoreContainer.add(valueText);
        scoreText.y = valueText.y + valueText.height * 0.5 - scoreText.height * 0.5;
        this.add(scoreContainer);
        scoreContainer.x = this.width * 0.5 - scoreContainer.width * 0.5;
        scoreContainer.y = this.height * 0.5 - scoreContainer.height - 50;
        var bigStarContainer = this.game.add.group();
        bigStarContainer.name = "bigStarContainer";
        var modeData = TWP2.GameModeDatabase.GetGameMode(TWP2.GameUtil.GetGameState().getData()["gameMode"]);
        var numStars = TWP2.GameModeDatabase.GetStarsForGameMode(modeData["id"], this.score);
        for (var i = 0; i < TWP2.GameModeDatabase.RANKED_STARS; i++) {
          var star = this.game.add.image(0, 0, "atlas_ui", "icon_star_large");
          var bStarMissed = i >= numStars;
          star.anchor.set(0.5, 0.5);
          star.x = i * star.width;
          star.tint = TWP2.ColourUtil.COLOUR_XP;
          star.alpha = bStarMissed ? 0.1 : 1;
          bigStarContainer.add(star);
          if (!bStarMissed) {
            //var tween = this.game.add.tween(star).from({ rotation: MathUtil.ToRad(90) }, 500, Phaser.Easing.Elastic.Out, true, i * 350);
          }
          var tween = this.game.add.tween(star.scale).from({ x: 0, y: 0 }, 300, Phaser.Easing.Back.InOut, true, i * 300);
          if (star.alpha == 1) {
            tween.onStart.addOnce(this.onStarShow, this);
          } else {
            tween.onStart.addOnce(this.onStarMissed, this);
          }
          if (i >= TWP2.GameModeDatabase.RANKED_STARS - 1) {
            tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_stars_remove");
          }
        }
        bigStarContainer.x = this.width * 0.5 - bigStarContainer.width * 0.5;
        bigStarContainer.y = this.height * 0.5 - bigStarContainer.height;
        this.add(bigStarContainer);
      } else if (_id == "tween_stars_remove") {
        var delayTime = 400;
        var scoreContainer = this.getByName("scoreContainer");
        var tween = this.game.add.tween(scoreContainer).to({ alpha: 0 }, 300, Phaser.Easing.Exponential.Out, true, delayTime);
        var bigStarContainer = this.getByName("bigStarContainer");
        var tween = this.game.add.tween(bigStarContainer).to({ alpha: 0, y: bigStarContainer.y + 100 }, 300, Phaser.Easing.Exponential.In, true, delayTime);
        tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_stats");
      } else if (_id == "tween_stats") {
        this.setBannerHeight(480);
        var scoreContainer = this.getByName("scoreContainer");
        if (scoreContainer) {
          scoreContainer.destroy();
        }
        var bigStarContainer = this.getByName("bigStarContainer");
        if (bigStarContainer) {
          bigStarContainer.destroy();
        }
        var modeData = TWP2.GameModeDatabase.GetGameMode(TWP2.GameUtil.GetGameState().getData()["gameMode"]);
        var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
        var padding = 12;
        var container = this.game.add.group();
        this.add(container);
        var titleText = this.game.add.text(0, 0, "Results: " + modeData["name"], { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        container.add(titleText);
        TWP2.GameUtil.SetTextShadow(titleText);
        var killsStat = new TWP2.GameStat("Kills", gameMode.getKills().toString());
        killsStat.y = container.height + 10;
        container.add(killsStat);
        var headshotsStat = new TWP2.GameStat("Headshots", gameMode.getHeadshots().toString(), undefined, gameMode.getHeadshots() > 0 && gameMode.getKills() == gameMode.getHeadshots() ? TWP2.ColourUtil.COLOUR_GREEN_STRING : undefined);
        headshotsStat.x = killsStat.width;
        headshotsStat.y = killsStat.y;
        container.add(headshotsStat);
        var accuracy = gameMode.getAccuracy();
        var accuracyStat = new TWP2.GameStat("Accuracy", Math.round(accuracy * 100) + "%", undefined, accuracy == 1 ? TWP2.ColourUtil.COLOUR_GREEN_STRING : undefined);
        accuracyStat.x = headshotsStat.x + headshotsStat.width;
        accuracyStat.y = killsStat.y;
        container.add(accuracyStat);
        var time = -1;
        if (!gameMode.isTimeLimited()) {
          time = gameMode.getTime();
          var timeStat = new TWP2.GameStat("Time", TWP2.GameUtil.ConvertToTimeString(time / 60));
          timeStat.x = accuracyStat.x + accuracyStat.width;
          timeStat.y = accuracyStat.y;
          container.add(timeStat);
        }
        if (gameMode.tracksMissedTargets()) {
          var numMissed = gameMode.getTargetsMissed();
          var missedStat = new TWP2.GameStat("Targets Missed", numMissed.toString(), undefined, numMissed == 0 ? TWP2.ColourUtil.COLOUR_GREEN_STRING : TWP2.ColourUtil.COLOUR_RED_STRING);
          missedStat.x = accuracyStat.x + accuracyStat.width;
          missedStat.y = accuracyStat.y;
          container.add(missedStat);
        }
        var scoreStat = new TWP2.GameStat("Total Score", this.score.toString(), 48, this.bNewBestScore ? TWP2.ColourUtil.COLOUR_GREEN_STRING : TWP2.ColourUtil.COLOUR_XP_STRING);
        var valueText = scoreStat.getValueText();
        TWP2.GameUtil.SetTextShadow(scoreStat.getValueText());
        scoreStat.x = container.width * 0.5 - scoreStat.width * 0.5;
        scoreStat.y = container.height + padding;
        container.add(scoreStat);
        var starContainer = new TWP2.StarContainer();
        var starsNum = TWP2.GameModeDatabase.GetStarsForGameMode(gameMode["id"], this.score);
        starContainer.setStars(starsNum);
        starContainer.x = container.width * 0.5 - starContainer.width * 0.5;
        starContainer.y = container.height + padding;
        container.add(starContainer);
        var lastBestScore = TWP2.PlayerUtil.player["bestScores"][gameMode["id"]];
        //PlayerUtil.GetRankedData()["bestScores"][GameModeDatabase.GAME_TOTAL_KILLS] += this.totalKills;
        var bestText = this.game.add.text(0, 0, this.bNewBestScore ? "New personal best!" : "Your personal best: " + lastBestScore, {
          font: "14px " + TWP2.FontUtil.FONT,
          fill: this.bNewBestScore ? TWP2.ColourUtil.COLOUR_GREEN_STRING : "#CCCCCC",
        });
        bestText.x = container.width * 0.5 - bestText.width * 0.5;
        bestText.y = container.height + padding;
        container.add(bestText);
        var bonusContainer = this.game.add.group();
        var xpBonus = 0;
        if (this.score > 0) {
          xpBonus = TWP2.PlayerUtil.player["level"] * 6;
          xpBonus += gameMode.getKills();
          xpBonus += gameMode.getHeadshots() * 2;
          xpBonus += Math.min(50, gameMode.getShotsHit() * accuracy);
          xpBonus += 75 * accuracy;
          if (gameMode instanceof TWP2.GameMode_TimeAttack) {
            xpBonus *= 0.8;
          }
          xpBonus *= 1 + TWP2.PlayerUtil.GetSkillValue(TWP2.SkillDatabase.SKILL_XP) * 0.1;
          xpBonus = Math.round(xpBonus);
          TWP2.PlayerUtil.AddXP(xpBonus);
        }
        var xpStat = new TWP2.GameStat("XP Bonus", "+" + TWP2.GameUtil.FormatNum(xpBonus) + "XP", undefined, TWP2.ColourUtil.COLOUR_XP_STRING);
        bonusContainer.add(xpStat);
        var moneyBonus = 0;
        if (this.score > 0) {
          moneyBonus += gameMode.getKills() * 2;
          moneyBonus += gameMode.getHeadshots() * 5;
          moneyBonus += (1000 * accuracy) / (this.score + 1);
          moneyBonus += gameMode.getMultiKills() * 5;
          moneyBonus += Math.round(this.score * 0.1);
          moneyBonus *= 1 + TWP2.PlayerUtil.GetSkillValue(TWP2.SkillDatabase.SKILL_MONEY) * 0.1;
          moneyBonus = Math.round(moneyBonus);
          TWP2.PlayerUtil.AddMoney(moneyBonus);
        }
        var moneyStat = new TWP2.GameStat("Money Bonus", "+$" + TWP2.GameUtil.FormatNum(moneyBonus), undefined, TWP2.ColourUtil.COLOUR_MONEY_STRING);
        moneyStat.x = bonusContainer.width + padding;
        bonusContainer.add(moneyStat);
        bonusContainer.x = container.width * 0.5 - bonusContainer.width * 0.5;
        bonusContainer.y = container.height + padding;
        container.add(bonusContainer);
        /*
              var widget = new ProfileWidget();
              widget.x = (container.width * 0.5) - (widget.width * 0.5);
              widget.y = container.height + (padding * 2);
              container.add(widget);
              */
        var buttons = this.game.add.group();
        var butWidth = 300;
        this.restartButton = new TWP2.MenuButton(butWidth, "center");
        this.restartButton.setCallback(this.onRestartClicked, this);
        this.restartButton.setLabelText("Try Again");
        buttons.add(this.restartButton);
        /*
              if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE)
              {
                  var submitButton = new MenuButton(butWidth, "center");
                  submitButton.setCallback(this.onSubmitClicked, this);
                  submitButton.setLabelText("Submit Score");
                  submitButton.y = buttons.height + 4;
                  buttons.add(submitButton);
              }
              */
        this.quitButton = new TWP2.MenuButton(butWidth, "center", TWP2.ColourUtil.COLOUR_RED);
        this.quitButton.setCallback(this.onQuitClicked, this);
        this.quitButton.setLabelText("Quit");
        this.quitButton.y = buttons.height + 4;
        buttons.add(this.quitButton);
        buttons.x = container.width * 0.5 - buttons.width * 0.5;
        buttons.y = container.height + padding * 3;
        container.add(buttons);
        titleText.x = container.width * 0.5 - titleText.width * 0.5;
        container.x = this.width * 0.25 - container.width * 0.5;
        container.y = this.height * 0.5 - container.height * 0.5;
        this.createLeaderboards();
        if (this.leaderboards) {
          //this.leaderboards.loadScores(GameUtil.GetGameState().getData()["gameMode"]);
        }
        var socialGroup = TWP2.GameUtil.CreateSocialGroup();
        socialGroup.x = this.leaderboardsContainer.width * 0.5 - socialGroup.width * 0.5;
        socialGroup.y = this.leaderboardsContainer.height + 20;
        this.leaderboardsContainer.add(socialGroup);
        var items = [titleText, killsStat, headshotsStat, accuracyStat, timeStat, missedStat, scoreStat, starContainer, bestText, bonusContainer, buttons, this.leaderboardsContainer, socialGroup];
        var showTime = 200;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item) {
            item.alpha = 0;
            var tween = this.game.add.tween(item).to({ alpha: 1 }, showTime, Phaser.Easing.Exponential.Out, true, showTime + i * 50);
          }
        }
        var tween = this.game.add.tween(container).from({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
        var tween = this.game.add.tween(this.leaderboardsContainer).from({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true, 100);
        tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_complete");
      } else if (_id == "tween_complete") {
        if (this.leaderboards) {
          this.leaderboards.loadScores(TWP2.GameUtil.GetGameState().getData()["gameMode"]);
        }
        this.onComplete();
      }
    };
    GameOverMenu.prototype.setBannerHeight = function (_val) {
      if (this.banner) {
        var tween = this.game.add.tween(this.banner).to({ height: _val }, 350, Phaser.Easing.Exponential.Out, true);
        return tween;
      }
      return null;
    };
    GameOverMenu.prototype.onComplete = function () {
      this.restartButton.setEnabled(true);
      this.quitButton.setEnabled(true);
    };
    GameOverMenu.prototype.createLeaderboards = function () {
      this.leaderboards = new TWP2.Leaderboards();
      this.leaderboardsContainer = this.game.add.group();
      var titleText = this.game.add.text(0, 0, "Leaderboards", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(titleText);
      this.leaderboardsContainer.add(titleText);
      this.leaderboardsContainer.add(this.leaderboards);
      titleText.x = this.leaderboards.width * 0.5 - titleText.width * 0.5;
      this.leaderboards.y = titleText.height + 10;
      this.leaderboardsContainer.x = this.width * 0.75 - this.leaderboardsContainer.width * 0.5;
      this.leaderboardsContainer.y = this.height * 0.5 - this.leaderboardsContainer.height * 0.5 - 30;
      this.add(this.leaderboardsContainer);
      var submitContainer = this.game.add.group();
      if (TWP2.APIUtil.IsLoggedIn()) {
        if (TWP2.APIUtil.HasLeaderboards()) {
          TWP2.APIUtil.SubmitScore(TWP2.GameUtil.GetGameState().getData()["gameMode"], this.score);
          var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
          checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
          submitContainer.add(checkmark);
          var submitText = this.game.add.text(0, 0, "Score Submitted!", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          submitText.x = checkmark.x + checkmark.width + 4;
          submitText.y = checkmark.height * 0.5 - submitText.height * 0.5 + 2;
          this.leaderboards.setSubmitContainer(submitContainer);
        }
      } else {
        var warningIcon = this.game.add.image(0, 0, "atlas_ui", "icon_alert");
        warningIcon.tint = TWP2.ColourUtil.COLOUR_XP;
        submitContainer.add(warningIcon);
        var submitText = this.game.add.text(0, 0, "You must be logged in to submit your score!", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        submitText.alpha = 0.2;
        submitText.x = warningIcon.x + warningIcon.width + 4;
        submitText.y = warningIcon.height * 0.5 - submitText.height * 0.5 + 2;
      }
      if (submitText) {
        submitContainer.add(submitText);
      }
      submitContainer.x = this.leaderboards.width * 0.5 - submitContainer.width * 0.5;
      submitContainer.y = this.leaderboards.y + this.leaderboards.height + 4;
      this.leaderboardsContainer.add(submitContainer);
      this.leaderboardsContainer.alpha = 0;
    };
    GameOverMenu.prototype.onSubmitClicked = function () {
      TWP2.APIUtil.SubmitScore(TWP2.GameUtil.GetGameState().getData()["gameMode"], this.score);
      if (this.leaderboards) {
        var timer = this.game.time.create();
        timer.add(1000, this.leaderboards.refresh, this.leaderboards);
        timer.start();
      }
      /* Total kills */
      //APIUtil.SubmitScore(GameModeDatabase.GAME_TOTAL_KILLS, this.totalKills);
    };
    GameOverMenu.prototype.onRestartClicked = function () {
      this.setOnCloseCallback(TWP2.GameUtil.game.restartGame, TWP2.GameUtil.game);
      this.close();
    };
    GameOverMenu.prototype.onQuitClicked = function () {
      this.setOnCloseCallback(TWP2.GameUtil.game.loadMenu, TWP2.GameUtil.game, [MainMenu.MENU_PLAY]);
      this.close();
    };
    return GameOverMenu;
  })(MenuBase);
  TWP2.GameOverMenu = GameOverMenu;
  var PauseMenu = /** @class */ (function (_super) {
    __extends(PauseMenu, _super);
    function PauseMenu() {
      var _this = _super.call(this) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, 0.5);
      gfx.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.add(gfx);
      var menu = _this.game.add.image(0, 0, "splash_1");
      menu.alpha = 0.25;
      _this.add(menu);
      _this.add(new TWP2.FXFilter());
      _this.backButton = new TWP2.BasicButton("icon_back");
      _this.backButton.setCallback(_this.loadMenu, _this, [PauseMenu.MENU_DEFAULT]);
      _this.backButton.x = 10;
      _this.backButton.y = 10;
      _this.add(_this.backButton);
      _this.randomButton = new TWP2.MenuButton(150, "left");
      _this.randomButton.setIcon(_this.game.add.image(0, 0, "atlas_ui", "icon_random"), "right");
      _this.randomButton.setLabelText("Random Weapon");
      _this.randomButton.setCallback(_this.randomWeapon, _this);
      _this.randomButton.x = _this.width - _this.randomButton.width - 10;
      _this.randomButton.y = 10;
      _this.add(_this.randomButton);
      _this.titleText = _this.game.add.text(0, 0, "", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      TWP2.GameUtil.SetTextShadow(_this.titleText);
      _this.titleText.setTextBounds(0, 2, _this.width, 20);
      _this.titleText.y = _this.backButton.y + _this.backButton.height * 0.5 - _this.titleText.height * 0.5;
      _this.add(_this.titleText);
      /*
          var agButton = new ImageButton("sponsor_ag_button");
          agButton.setCallback(GameUtil.OpenAGHomepage, GameUtil);
          agButton.x = 10;
          agButton.y = 10;
          this.add(agButton);
          */
      _this.container = _this.game.add.group();
      _this.container.y = _this.titleText.y + _this.titleText.height + 20;
      _this.add(_this.container);
      _this.loadMenu(PauseMenu.MENU_DEFAULT);
      TWP2.SoundManager.PlayUISound("ui_window_open");
      return _this;
    }
    PauseMenu.prototype.destroy = function () {
      this.titleText = null;
      this.container = null;
      this.backButton = null;
      this.randomButton = null;
      _super.prototype.destroy.call(this);
    };
    PauseMenu.prototype.refreshMenu = function () {
      if (this.currentMenu == PauseMenu.MENU_DEFAULT) {
        var settingsBox = this.container.getByName("settingsBox");
        var settingsContainer = settingsBox.getByName("settingsContainer");
        var gameVolume = settingsContainer.getByName("gameVolume");
        gameVolume.getSlider().setValue(TWP2.PlayerUtil.player.settings["gameVolume"] * 10, true);
        var musicVolume = settingsContainer.getByName("musicVolume");
        musicVolume.getSlider().setValue(TWP2.PlayerUtil.player.settings["gameVolume"] * 10, true);
      }
    };
    PauseMenu.prototype.randomWeapon = function () {
      var weapon = TWP2.WeaponDatabase.GetRandomWeapon();
      var char = TWP2.GameUtil.GetGameState().getPlayerPawn();
      char.replaceInventoryItem(weapon, 0);
      TWP2.GameUtil.GetGameState().setPaused(false);
      TWP2.GameUtil.game.world.camera.x = 0;
    };
    PauseMenu.prototype.loadMenu = function (_id) {
      this.container.removeAll(true);
      this.currentMenu = _id;
      if (_id == PauseMenu.MENU_DEFAULT) {
        this.titleText.setText("Game Paused", true);
        this.backButton.visible = false;
        this.randomButton.visible = false;
        var buttonAlign = "center";
        var buttonWidth = 320;
        var buttonPadding = 4;
        var buttons = this.game.add.group();
        this.add(buttons);
        var gameMode = TWP2.GameUtil.GetGameState().getGameMode();
        if (gameMode instanceof TWP2.GameMode_Range) {
          var weaponButton = new TWP2.MenuButton(buttonWidth * 0.5 - buttonPadding * 0.5, buttonAlign);
          weaponButton.setCallback(this.onChangeWeaponClicked, this);
          //weaponButton.setLabelText("Select Weapon");
          buttons.add(weaponButton);
          var char = TWP2.GameUtil.GetGameState().getPlayerPawn();
          var item = char.getCurrentInventoryItem();
          var weaponIcon = this.game.add.image(0, 0, "atlas_weapons_icons_small", item["id"]);
          weaponButton.setIcon(weaponIcon, "center");
          var modsButton = new TWP2.MenuButton(buttonWidth * 0.5 - buttonPadding * 0.5, buttonAlign);
          modsButton.setCallback(this.onModsClicked, this);
          modsButton.setLabelText("Mods");
          modsButton.x = weaponButton.x + weaponButton.width + 4;
          buttons.add(modsButton);
        }
        var resumeButton = new TWP2.MenuButton(buttonWidth, buttonAlign, TWP2.ColourUtil.COLOUR_GREEN);
        resumeButton.setCallback(this.onResumeClicked, this);
        resumeButton.setLabelText("Resume");
        resumeButton.y = buttons.height + (buttons.height > 0 ? buttonPadding : 0);
        buttons.add(resumeButton);
        var bShowXP = false; //gameMode.usesXP();
        if (bShowXP) {
          var rankBar = new TWP2.RankBar();
          rankBar.x = this.game.width * 0.5 - rankBar.width * 0.5;
          rankBar.y = this.game.height - rankBar.height - 10 - this.container.y;
          this.container.add(rankBar);
        }
        var restartButton = new TWP2.MenuButton(buttonWidth, buttonAlign);
        restartButton.setCallback(this.onRestartClicked, this);
        restartButton.setLabelText("Restart");
        restartButton.y = buttons.height + buttonPadding;
        buttons.add(restartButton);
        var quitButton = new TWP2.MenuButton(buttonWidth, buttonAlign, TWP2.ColourUtil.COLOUR_RED);
        quitButton.setCallback(this.onQuitClicked, this);
        quitButton.setLabelText("Quit");
        quitButton.y = buttons.height + buttonPadding;
        buttons.add(quitButton);
        buttons.x = this.game.width * 0.5 - buttons.width * 0.5 - this.container.x * 2;
        this.container.add(buttons);
        var boxWidth = 732;
        var boxHeight = 140;
        var gameContainer = this.game.add.group();
        var gfx = this.game.add.graphics();
        gfx.beginFill(0x000000, 0.5);
        gfx.drawRoundedRect(0, 0, boxWidth, boxHeight, TWP2.GameUtil.RECT_RADIUS);
        gameContainer.add(gfx);
        var modeIcon = this.game.add.image(0, 0, "atlas_ui", gameMode.getId());
        modeIcon.x = 20;
        modeIcon.y = gfx.height * 0.5 - modeIcon.height * 0.5;
        gameContainer.add(modeIcon);
        var gameTextContainer = this.game.add.group();
        gameContainer.add(gameTextContainer);
        var gameModeData = TWP2.GameModeDatabase.GetGameMode(gameMode.getId());
        var modeText = this.game.add.text(0, 0, gameModeData["name"], { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "left", boundsAlignV: "middle" });
        TWP2.GameUtil.SetTextShadow(modeText);
        modeText.setTextBounds(0, 0, boxWidth * 0.5, 20);
        modeText.x = modeIcon.x + modeIcon.width;
        gameTextContainer.add(modeText);
        var modeDescText = this.game.add.text(0, 0, gameModeData["desc"], { font: "16px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
        TWP2.GameUtil.SetTextShadow(modeDescText);
        modeDescText.setTextBounds(0, 0, boxWidth * 0.5, 20);
        modeDescText.x = modeText.x;
        modeDescText.y = gameTextContainer.height - 4;
        gameTextContainer.add(modeDescText);
        gameTextContainer.x = gameTextContainer.y = modeIcon.y + modeIcon.height * 0.5 - gameTextContainer.height * 0.5 + 5; //modeIcon.x + modeIcon.width;
        gameContainer.x = this.game.width * 0.5 - gameContainer.width * 0.5;
        gameContainer.y = this.container.height + 20;
        this.container.add(gameContainer);
        if (gameMode instanceof TWP2.GameMode_Range) {
          var targetButton = new TWP2.RangeTargetSelectorButton();
          var range = gameMode;
          var currentTarget = range.getCurrentTarget();
          var desiredTarget = "target_" + currentTarget[0] + "_" + currentTarget[1];
          targetButton.setIcon(desiredTarget);
          targetButton.setCallback(this.onTargetClicked, this, [targetButton]);
          targetButton.x = gameContainer.width - targetButton.width - 10;
          targetButton.y = gameContainer.height * 0.5 - targetButton.height * 0.5;
          gameContainer.add(targetButton);
        } else {
          var timeText = this.game.add.text(0, 0, TWP2.GameUtil.ConvertToTimeString(TWP2.GameUtil.GetGameState().getGameMode().getTime() / 60), { font: "24px " + TWP2.FontUtil.FONT_HUD, fill: "#FFFFFF" });
          timeText.alpha = 0.2;
          timeText.x = gameContainer.width - timeText.width - 10;
          timeText.y = gameContainer.height * 0.5 - timeText.height * 0.5;
          gameContainer.add(timeText);
        }
        var settingsBox = this.game.add.group();
        settingsBox.name = "settingsBox";
        var gfx = this.game.add.graphics();
        gfx.beginFill(0x000000, 0.5);
        gfx.drawRoundedRect(0, 0, boxWidth, boxHeight, TWP2.GameUtil.RECT_RADIUS);
        settingsBox.add(gfx);
        this.container.add(settingsBox);
        var settingsContainer = this.game.add.group();
        var sliders = this.game.add.group();
        sliders.name = "settingsContainer";
        settingsBox.add(sliders);
        var sliderWidth = 300;
        var gameVolume = new TWP2.Modifier("gameVolume", TWP2.Modifier.MODIFIER_SLIDER, {
          label: "Game Volume",
          w: sliderWidth,
          min: 0,
          max: 10,
          increment: 1,
          value: TWP2.PlayerUtil.player.settings["gameVolume"] * 10,
        });
        gameVolume.setUpdateCallback(TWP2.PlayerUtil.SetGameVolume, TWP2.PlayerUtil);
        sliders.add(gameVolume);
        var musicVolume = new TWP2.Modifier("gameVolume", TWP2.Modifier.MODIFIER_SLIDER, {
          label: "Music Volume",
          w: sliderWidth,
          min: 0,
          max: 10,
          increment: 1,
          value: TWP2.PlayerUtil.player.settings["musicVolume"] * 10,
        });
        musicVolume.setUpdateCallback(TWP2.PlayerUtil.SetMusicVolume, TWP2.PlayerUtil);
        musicVolume.x = gameVolume.x;
        musicVolume.y = gameVolume.y + gameVolume.height + 4;
        sliders.add(musicVolume);
        var buts = this.game.add.group();
        var effectsButton = new TWP2.MenuButton(undefined, "left");
        effectsButton.setToggle(true);
        effectsButton.setSelected(TWP2.PlayerUtil.player.settings["bEffects"]);
        effectsButton.setCallback(TWP2.PlayerUtil.ToggleSetting, TWP2.PlayerUtil, ["bEffects", effectsButton]);
        effectsButton.setLabelText("Effects");
        buts.add(effectsButton);
        var shellsButton = new TWP2.MenuButton(undefined, "left");
        shellsButton.setToggle(true);
        shellsButton.setSelected(TWP2.PlayerUtil.player.settings["bShells"]);
        shellsButton.setCallback(TWP2.PlayerUtil.ToggleSetting, TWP2.PlayerUtil, ["bShells", shellsButton]);
        shellsButton.setLabelText("Shells");
        shellsButton.y = effectsButton.y + effectsButton.height + 4;
        buts.add(shellsButton);
        var magsButton = new TWP2.MenuButton(undefined, "left");
        magsButton.setToggle(true);
        magsButton.setSelected(TWP2.PlayerUtil.player.settings["bMags"]);
        magsButton.setCallback(TWP2.PlayerUtil.ToggleSetting, TWP2.PlayerUtil, ["bMags", magsButton]);
        magsButton.setLabelText("Mags");
        magsButton.y = shellsButton.y + shellsButton.height + 4;
        buts.add(magsButton);
        settingsContainer.add(sliders);
        settingsContainer.add(buts);
        buts.x = sliders.x + sliders.width + 16;
        sliders.y = buts.height * 0.5 - sliders.height * 0.5;
        settingsContainer.x = settingsBox.width * 0.5 - settingsContainer.width * 0.5;
        settingsContainer.y = settingsBox.height * 0.5 - settingsContainer.height * 0.5;
        settingsBox.add(settingsContainer);
        settingsBox.x = this.width * 0.5 - settingsBox.width * 0.5;
        settingsBox.y = this.container.height + 4;
        var volumeToggler = new TWP2.VolumeToggler();
        volumeToggler.x = this.game.width - volumeToggler.width - 10;
        volumeToggler.y = -this.container.y + 10;
        volumeToggler.setCallback(this.updateAudio, this);
        this.container.add(volumeToggler);
        var socialGroup = TWP2.GameUtil.CreateSocialGroup();
        socialGroup.x = this.game.width * 0.5 - socialGroup.width * 0.5;
        socialGroup.y = this.game.height - socialGroup.height - this.container.y - 4;
        this.container.add(socialGroup);
      } else if (_id == PauseMenu.MENU_WEAPONS) {
        this.titleText.setText("Select Weapon", true);
        this.backButton.visible = true;
        this.randomButton.visible = true;
        var char = TWP2.GameUtil.GetGameState().getPlayerPawn();
        var item = char.getCurrentInventoryItem();
        var itemSelector = new TWP2.ItemSelector(false);
        itemSelector.x = 10;
        var types = [
          {
            id: TWP2.WeaponDatabase.TYPE_PISTOL,
            label: "Pistols",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_MACHINE_PISTOL,
            label: "Machine Pistols",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_SMG,
            label: "SMGs",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_RIFLE,
            label: "Assault Rifles",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_SNIPER,
            label: "High-Powered Rifles",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_SHOTGUN,
            label: "Shotguns",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_LMG,
            label: "LMGs",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_LAUNCHER,
            label: "Launchers",
          },
        ];
        itemSelector.setCurrentItemId(item["id"]);
        itemSelector.setWeaponTypes(types, item["type"]);
        this.container.add(itemSelector);
      }
      this.container.alpha = 0;
      var tween = this.game.add.tween(this.container).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
    };
    PauseMenu.prototype.updateAudio = function () {
      this.loadMenu(PauseMenu.MENU_DEFAULT);
    };
    PauseMenu.prototype.onTargetClicked = function (_button) {
      var range = TWP2.GameUtil.GetGameState().getGameMode();
      if (range) {
        range.nextTargetType();
        var currentTarget = range.getCurrentTarget();
        var desiredTarget = "target_" + currentTarget[0] + "_" + currentTarget[1];
        _button.setIcon(desiredTarget);
      }
    };
    PauseMenu.prototype.onResumeClicked = function () {
      TWP2.GameUtil.GetGameState().setPaused(false);
    };
    PauseMenu.prototype.onChangeWeaponClicked = function () {
      this.loadMenu(PauseMenu.MENU_WEAPONS);
    };
    PauseMenu.prototype.onModsClicked = function () {
      var char = TWP2.GameUtil.GetGameState().getPlayerPawn();
      var item = char.getCurrentInventoryItem();
      TWP2.GameUtil.game.createWindow({
        titleText: item["name"] + " Mods",
        messageText: "Customize weapon mods.",
        weapon: item,
        type: TWP2.Window.TYPE_MODS,
        bShowOkayButton: true,
      });
    };
    PauseMenu.prototype.onQuitClicked = function () {
      TWP2.GameUtil.game.createWindow({
        titleText: "Quit",
        type: TWP2.Window.TYPE_YES_NO,
        messageText: "Are you sure you want to quit this game?",
        yesCallback: TWP2.GameUtil.game.loadMenu,
        yesCallbackContext: TWP2.GameUtil.game,
        yesCallbackParams: [TWP2.GameUtil.GetGameState().getGameMode().getId() == TWP2.GameModeDatabase.GAME_RANGE ? MainMenu.MENU_MAIN : MainMenu.MENU_PLAY],
      });
    };
    PauseMenu.prototype.onRestartClicked = function () {
      TWP2.GameUtil.game.createWindow({
        titleText: "Restart",
        type: TWP2.Window.TYPE_YES_NO,
        messageText: "Are you sure you want to restart this game?",
        yesCallback: TWP2.GameUtil.game.restartGame,
        yesCallbackContext: TWP2.GameUtil.game,
      });
    };
    PauseMenu.MENU_DEFAULT = "MENU_DEFAULT";
    PauseMenu.MENU_WEAPONS = "MENU_WEAPONS";
    return PauseMenu;
  })(MenuBase);
  TWP2.PauseMenu = PauseMenu;
  var SetKeyMenu = /** @class */ (function (_super) {
    __extends(SetKeyMenu, _super);
    function SetKeyMenu(_keyId, _callback, _callbackContext) {
      var _this = _super.call(this) || this;
      _this.messageY = 0;
      _this.keyId = _keyId;
      _this.callback = _callback;
      _this.callbackContext = _callbackContext;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, 0.5);
      gfx.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.add(gfx);
      var closeButton = new TWP2.ImageButton("atlas_ui", "icon_close");
      closeButton.setCallback(_this.close, _this);
      closeButton.x = _this.width - closeButton.width - 10;
      closeButton.y = 10;
      _this.add(closeButton);
      var totalWidth = _this.width * 0.5;
      var container = _this.game.add.group();
      var bg = _this.game.add.graphics();
      bg.beginFill(0xffffff, 0);
      bg.drawRect(0, 0, totalWidth, 100);
      container.add(bg);
      _this.add(container);
      var infoText = _this.game.add.text(0, 0, "Press key to assign:", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      infoText.x = totalWidth * 0.5 - infoText.width * 0.5;
      infoText.alpha = 0.8;
      container.add(infoText);
      var text = _this.game.add.text(0, 0, TWP2.PlayerUtil.GetKeyDescription(_keyId), { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center" });
      TWP2.GameUtil.SetTextShadow(text);
      text.x = totalWidth * 0.5 - text.width * 0.5;
      text.y = infoText.height;
      container.add(text);
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 1);
      gfx.drawRect(0, 0, 24, 2);
      gfx.x = totalWidth * 0.5 - gfx.width * 0.5;
      gfx.y = text.y + text.height + 24;
      container.add(gfx);
      var tween = _this.game.add.tween(gfx).to({ alpha: 0 }, 150, Phaser.Easing.Exponential.InOut, true, 0, Number.MAX_VALUE, true);
      container.x = _this.width * 0.5 - container.width * 0.5;
      container.y = _this.height * 0.5 - container.height * 0.5;
      _this.messageText = _this.game.add.text(0, 0, "", { font: "16px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_RED_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      _this.messageText.setTextBounds(0, 0, _this.width, 20);
      _this.messageText.y = container.y + container.height + 20;
      _this.messageY = _this.messageText.y;
      _this.add(_this.messageText);
      _this.show();
      return _this;
    }
    SetKeyMenu.prototype.destroy = function () {
      this.callback = null;
      this.callbackContext = null;
      TWP2.GameUtil.game.input.keyboard.onDownCallback = null;
      TWP2.GameUtil.game.input.keyboard.callbackContext = null;
      TWP2.GameUtil.game.onSetKeyMenuDestroyed();
      _super.prototype.destroy.call(this);
    };
    SetKeyMenu.prototype.show = function () {
      _super.prototype.show.call(this);
      TWP2.SoundManager.PlayUISound("ui_window_open");
    };
    SetKeyMenu.prototype.close = function () {
      _super.prototype.close.call(this);
      TWP2.SoundManager.PlayUISound("ui_window_close");
    };
    SetKeyMenu.prototype.onShow = function () {
      _super.prototype.onShow.call(this);
      TWP2.GameUtil.game.input.keyboard.onDownCallback = this.onKeySet;
      TWP2.GameUtil.game.input.keyboard.callbackContext = this;
    };
    SetKeyMenu.prototype.onClose = function () {
      _super.prototype.onClose.call(this);
      this.destroy();
    };
    SetKeyMenu.prototype.onKeySet = function (_event) {
      var invalid = [Phaser.Keyboard.ESC, Phaser.Keyboard.ONE, Phaser.Keyboard.TWO];
      if (_event.keyCode == invalid[0]) {
        this.close();
      } else if (invalid.indexOf(_event.keyCode) >= 0) {
        TWP2.SoundManager.PlayUISound("ui_error");
        this.messageText.setText("INVALID KEY", true);
        this.messageText.alpha = 1;
        var tween = this.game.add.tween(this.messageText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.InOut, true);
        this.messageText.y = this.messageY + 30;
        var tween = this.game.add.tween(this.messageText).to({ y: this.messageY }, 500, Phaser.Easing.Back.Out, true);
      } else {
        this.game.input.keyboard.onDownCallback = null;
        this.game.input.keyboard.callbackContext = null;
        var controls = TWP2.PlayerUtil.GetControlsData();
        controls[this.keyId] = _event.keyCode;
        TWP2.GameUtil.game.savePlayerData();
        TWP2.SoundManager.PlayUISound("ui_confirm");
        if (this.callback) {
          this.callback.apply(this.callbackContext);
        }
        this.close();
      }
    };
    return SetKeyMenu;
  })(ElementBase);
  TWP2.SetKeyMenu = SetKeyMenu;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var FXFilter = /** @class */ (function (_super) {
    __extends(FXFilter, _super);
    function FXFilter() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.createFilter();
      return _this;
    }
    FXFilter.prototype.destroy = function () {
      if (this.fxFilter) {
        this.fxFilter.dirty = true;
        this.fxFilter.destroy();
      }
      _super.prototype.destroy.call(this);
    };
    FXFilter.prototype.update = function () {
      if (this.fxFilter) {
        this.fxFilter.update();
      }
    };
    FXFilter.prototype.createFilter = function () {
      var fragmentSrc = [
        "precision mediump float;",
        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform vec2      mouse;",
        "float noise(vec2 pos) {",
        "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
        "}",
        "void main( void ) {",
        "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
        "float pos = (gl_FragCoord.y / resolution.y);",
        "float mouse_dist = 0.0;",
        "float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);",
        "pos -= (distortion * distortion) * 0.1;",
        "float c = sin(pos * 1200.0) * 0.25 + 0.75;",
        "c = pow(c, 0.5);",
        "c *= 0.5;",
        "c += distortion * 0.3;",
        "// noise",
        "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
        "gl_FragColor = vec4( 0.01, c * 0.11, c * 0.21, 0.0 );",
        "}",
      ];
      this.fxFilter = new Phaser.Filter(this.game, null, fragmentSrc);
      this.fxFilter.setResolution(this.game.width, this.game.height);
      var img = this.game.add.sprite(0, 0);
      img.width = this.game.width;
      img.height = this.game.height;
      img.filters = [this.fxFilter];
      this.add(img);
    };
    return FXFilter;
  })(Phaser.Group);
  TWP2.FXFilter = FXFilter;
  var BandFilter = /** @class */ (function (_super) {
    __extends(BandFilter, _super);
    function BandFilter() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.createFilter();
      return _this;
    }
    BandFilter.prototype.destroy = function () {
      if (this.fxFilter) {
        this.fxFilter.dirty = true;
        this.fxFilter.destroy();
      }
      _super.prototype.destroy.call(this);
    };
    BandFilter.prototype.update = function () {
      if (this.fxFilter) {
        this.fxFilter.update();
      }
    };
    BandFilter.prototype.createFilter = function () {
      var fragmentSrc = [
        "precision mediump float;",
        "uniform float     time;",
        "uniform vec2     resolution;",
        "#define PI 3.1415926535897932384626433832795",
        "const float position = 0.0;",
        "const float scale = 0.1;",
        "const float intensity = 1.0;",
        "float band(vec2 pos, float amplitude, float frequency) {",
        "float wave = scale * amplitude * sin(1.0 * PI * frequency * pos.x + time) / 2.05;",
        "float light = clamp(amplitude * frequency * 0.02, 0.001 + 0.001 / scale, 5.0) * scale / abs(wave - pos.y);",
        "return light;",
        "}",
        "void main() {",
        "vec3 color = vec3(1.0, 1.5, 2.0);",
        "color = color == vec3(0.0)? vec3(0.1, 0.1, 5.0) : color;",
        "vec2 pos = (gl_FragCoord.xy / resolution.xy);",
        "pos.y += - 0.5;",
        "float spectrum = 0.0;",
        "const float lim = 1.0;",
        "#define time time*0.037 + pos.x*10.",
        "for(float i = 0.0; i < lim; i++){",
        "spectrum += band(pos, 1.0*sin(time*0.1/PI), 1.0*sin(time*i/lim))/pow(lim, 0.25);",
        "}",
        "spectrum += band(pos, cos(10.7), 2.5);",
        "spectrum += band(pos, 0.4, sin(2.0));",
        "spectrum += band(pos, 0.05, 4.5);",
        "spectrum += band(pos, 0.1, 7.0);",
        "spectrum += band(pos, 0.1, 1.0);",
        "gl_FragColor = vec4(color * spectrum, spectrum);",
        "}",
      ];
      this.fxFilter = new Phaser.Filter(this.game, null, fragmentSrc);
      this.fxFilter.setResolution(this.game.width, this.game.height);
      var img = this.game.add.sprite(0, 0);
      img.width = this.game.width;
      img.height = this.game.height;
      img.filters = [this.fxFilter];
      this.add(img);
    };
    return BandFilter;
  })(Phaser.Group);
  TWP2.BandFilter = BandFilter;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var WeaponInfo = /** @class */ (function (_super) {
    __extends(WeaponInfo, _super);
    function WeaponInfo() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.1);
      gfx.drawRect(0, 0, _this.game.width * 0.4, _this.game.height * 0.4);
      _this.add(_this.game.add.image(0, 0, gfx.generateTexture()));
      gfx.destroy();
      _this.titleText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.titleText.setTextBounds(0, 4, _this.width, 32);
      _this.add(_this.titleText);
      _this.killsText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle", align: "center" });
      _this.killsText.alpha = 0.8;
      _this.killsText.setTextBounds(0, 0, _this.width, 60);
      _this.killsText.y = _this.titleText.y + _this.titleText.height;
      _this.add(_this.killsText);
      return _this;
    }
    WeaponInfo.prototype.destroy = function () {
      this.killsText = null;
      this.weaponIcon = null;
      _super.prototype.destroy.call(this);
    };
    WeaponInfo.prototype.setWeapon = function (_id) {
      if (this.weaponIcon) {
        this.weaponIcon.destroy();
      }
      var weaponData = TWP2.WeaponDatabase.GetWeapon(_id);
      this.weaponIcon = TWP2.GameUtil.CreateWeapon(weaponData);
      this.weaponIcon.scale.set(0.75, 0.75);
      this.weaponIcon.x = this.width * 0.5 - this.weaponIcon.width * 0.5;
      this.weaponIcon.y = this.killsText.y + this.killsText.height + 50;
      this.add(this.weaponIcon);
      this.titleText.setText(weaponData["name"], true);
    };
    WeaponInfo.prototype.setWeaponMod = function (_id) {
      if (this.weaponIcon) {
        if (_id) {
          var modType = TWP2.WeaponDatabase.GetModType(_id);
          if (modType == TWP2.WeaponDatabase.MOD_BARREL) {
            var m203 = this.weaponIcon.getByName(TWP2.WeaponDatabase.BARREL_M203);
            if (m203) {
              m203.visible = _id == m203.name;
            }
            var laser = this.weaponIcon.getByName(TWP2.WeaponDatabase.BARREL_LASER);
            if (laser) {
              laser.visible = _id == laser.name;
            }
          } else if (modType == TWP2.WeaponDatabase.MOD_OPTIC) {
            var optic = this.weaponIcon.getByName("optic");
            if (optic) {
              optic.frameName = _id;
            }
          } else if (modType == TWP2.WeaponDatabase.MOD_MAG) {
            var mag = this.weaponIcon.getByName("mag");
            if (mag) {
              mag.frameName = _id;
            }
          }
        } else {
          var optic = this.weaponIcon.getByName("optic");
          if (optic) {
            optic.frameName = TWP2.WeaponDatabase.OPTIC_DEFAULT;
          }
          var mag = this.weaponIcon.getByName("mag");
          if (mag) {
            mag.frameName = TWP2.WeaponDatabase.MAG_DEFAULT;
          }
          var m203 = this.weaponIcon.getByName(TWP2.WeaponDatabase.BARREL_M203);
          if (m203) {
            m203.visible = false;
          }
          var laser = this.weaponIcon.getByName(TWP2.WeaponDatabase.BARREL_LASER);
          if (laser) {
            laser.visible = false;
          }
        }
      }
    };
    WeaponInfo.prototype.setText = function (_kills, _headshots) {
      this.killsText.setText("Kills: " + _kills + "\nHeadshots: " + _headshots, true);
    };
    return WeaponInfo;
  })(Phaser.Group);
  TWP2.WeaponInfo = WeaponInfo;
  var ItemSelectorStats = /** @class */ (function (_super) {
    __extends(ItemSelectorStats, _super);
    function ItemSelectorStats() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var padding = 2;
      var barWidth = 350;
      var barHeight = 4;
      var barX = 80;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.5);
      bg.drawRoundedRect(0, 0, 500, 228, TWP2.GameUtil.RECT_RADIUS);
      _this.add(bg);
      var container = _this.game.add.group();
      _this.add(container);
      var statsText = _this.game.add.text(0, 0, "Weapon Specs", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      container.add(statsText);
      _this.killsText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.killsText.alpha = 0.8;
      _this.killsText.y = container.height - 2;
      container.add(_this.killsText);
      _this.stats = new TWP2.StatsContainer();
      _this.stats.y = container.height + 8;
      container.add(_this.stats);
      _this.prestige = _this.game.add.group();
      var icon = _this.game.add.image(0, 0, "atlas_ui", "icon_star");
      icon.tint = TWP2.ColourUtil.COLOUR_XP;
      _this.prestige.add(icon);
      var prestigeText = _this.game.add.text(0, 0, "Prestige Weapon", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      prestigeText.x = _this.prestige.width + 4;
      prestigeText.y = _this.prestige.height * 0.5 - prestigeText.height * 0.5 + 3;
      _this.prestige.add(prestigeText);
      container.add(_this.prestige);
      _this.prestige.x = container.width - _this.prestige.width - 10;
      _this.prestige.visible = false;
      container.x = bg.width * 0.5 - container.width * 0.5;
      container.y = bg.height * 0.5 - container.height * 0.5;
      return _this;
    }
    ItemSelectorStats.prototype.setFromData = function (_data) {
      this.stats.setWeapon(_data, null);
      var weaponData = TWP2.PlayerUtil.player["weapons"][_data["id"]];
      this.killsText.setText(weaponData["kills"] + " kills â€¢ " + weaponData["headshots"] + " headshots");
      this.prestige.visible = _data["bPrestige"] == true;
    };
    return ItemSelectorStats;
  })(Phaser.Group);
  TWP2.ItemSelectorStats = ItemSelectorStats;
  var ItemSelector = /** @class */ (function (_super) {
    __extends(ItemSelector, _super);
    function ItemSelector(_bLockItems) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.bLockItems = true;
      _this.bLockItems = _bLockItems;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0xffffff, 0);
      gfx.drawRect(0, 0, _this.game.width - 20, _this.game.height * 0.6);
      _this.add(gfx);
      _this.itemButtons = _this.game.add.group();
      _this.add(_this.itemButtons);
      _this.weaponStats = new ItemSelectorStats();
      _this.weaponStats.visible = false;
      _this.add(_this.weaponStats);
      _this.itemNameText = _this.game.add.text(0, 0, "", { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      TWP2.GameUtil.SetTextShadow(_this.itemNameText);
      _this.add(_this.itemNameText);
      _this.itemDescText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.itemDescText.alpha = 0.8;
      _this.add(_this.itemDescText);
      _this.magContainer = _this.game.add.group();
      var magIcon = _this.game.add.image(0, 1, "atlas_ui", "icon_mag");
      _this.magContainer.add(magIcon);
      _this.magText = _this.game.add.text(magIcon.width + 4, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.magContainer.add(_this.magText);
      _this.add(_this.magContainer);
      _this.magContainer.visible = false;
      return _this;
    }
    ItemSelector.prototype.destroy = function () {
      this.weaponInfo = null;
      this.itemButtons = null;
      this.itemNameText = null;
      this.itemImage = null;
      this.weaponStats = null;
      this.buttons = null;
      _super.prototype.destroy.call(this);
    };
    Object.defineProperty(ItemSelector.prototype, "height", {
      get: function () {
        return this.game.height * 0.6;
      },
      enumerable: true,
      configurable: true,
    });
    ItemSelector.prototype.setOnCloseCallback = function (_callback, _callbackContext) {
      this.closeCallback = _callback;
      this.closeCallbackContext = _callbackContext;
    };
    ItemSelector.prototype.setPrevMenuId = function (_val) {
      this.prevMenuId = _val;
    };
    ItemSelector.prototype.setCurrentClassIndex = function (_val) {
      this.currentClassIndex = _val;
    };
    ItemSelector.prototype.setCurrentTypeSlot = function (_type) {
      this.currentTypeSlot = _type;
    };
    ItemSelector.prototype.setCurrentItemId = function (_id) {
      this.currentItemId = _id;
    };
    ItemSelector.prototype.setWeaponTypes = function (_types, _typeToLoad) {
      if (_typeToLoad === void 0) {
        _typeToLoad = null;
      }
      this.buttons = [];
      var container = this.game.add.group();
      this.add(container);
      var padding = 4;
      var buttonWidth = this.width / _types.length - padding + 1;
      var indexToLoad = 0;
      var pageToLoad = 0;
      for (var i = 0; i < _types.length; i++) {
        var type = _types[i];
        var typeButton = new TWP2.MenuButton(buttonWidth, "center");
        typeButton.setFullAlphaWhenSelected(true);
        typeButton.setCallback(this.onCategoryClicked, this, [type["id"], typeButton]);
        typeButton.setButtonData(type);
        typeButton.setLabelText(type["label"]);
        typeButton.x = container.width + (i > 0 ? padding : 0);
        container.add(typeButton);
        this.buttons.push(typeButton);
        if (type["id"] == _typeToLoad) {
          indexToLoad = i;
          pageToLoad = 0; //Math.floor(i / ItemSelector.MAX_ITEMS_PER_PAGE);
        }
      }
      this.updateButtons();
      this.itemButtons.y = container.y + container.height + padding * 2;
      if (_types.length > 0) {
        var weaponTypes = TWP2.WeaponDatabase.GetAllWeaponsByType(_typeToLoad);
        if (weaponTypes) {
          for (var i = 0; i < weaponTypes.length; i++) {
            if (weaponTypes[i]["id"] == this.currentItemId) {
              pageToLoad = Math.floor(i / ItemSelector.MAX_ITEMS_PER_PAGE);
              break;
            }
          }
        }
        this.loadWeaponCategory(_types[indexToLoad]["id"], pageToLoad);
      }
      this.itemNameText.x = this.itemButtons.x + this.itemButtons.width + padding * 4;
      this.itemNameText.y = this.itemButtons.y;
      this.itemDescText.x = this.itemNameText.x;
      this.itemDescText.y = this.itemNameText.y + this.itemNameText.height - 4;
      this.magContainer.x = this.itemNameText.x;
      this.magContainer.y = this.itemDescText.y + this.itemDescText.height - 2;
    };
    ItemSelector.prototype.updateButtons = function () {
      if (this.buttons) {
        if (this.bLockItems) {
          for (var i = 0; i < this.buttons.length; i++) {
            var typeButton = this.buttons[i];
            var type = typeButton.getButtonData();
            if (TWP2.PlayerUtil.HasPendingItemsForWeaponCategories([type["id"]])) {
              var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
              newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
              typeButton.setIcon(newIcon);
            } else {
              typeButton.setIcon(null);
            }
          }
        }
      }
    };
    ItemSelector.prototype.loadWeaponCategory = function (_type, _page) {
      if (_page === void 0) {
        _page = 0;
      }
      for (var i = 0; i < this.buttons.length; i++) {
        var data = this.buttons[i].getButtonData();
        var bSelected = data["id"] == _type;
        this.buttons[i].setSelected(bSelected);
        //this.buttons[i].setIcon(bSelected ? this.game.add.image(0, 0, "atlas_ui", "icon_checkmark") : null);
      }
      this.itemButtons.removeAll(true);
      var padding = 4;
      var weapons = TWP2.WeaponDatabase.GetAllWeaponsByType(_type);
      var startIndex = _page * ItemSelector.MAX_ITEMS_PER_PAGE;
      var viewable = weapons.slice(startIndex);
      for (var i = 0; i < Math.min(viewable.length, ItemSelector.MAX_ITEMS_PER_PAGE); i++) {
        var itemButton = new TWP2.ClassItemButton();
        itemButton.setCallback(this.onItemClicked, this, ["weapon", viewable[i]["id"]]);
        itemButton.setWeapon(viewable[i]);
        if (viewable[i]["id"] == this.currentItemId) {
          itemButton.setAsCurrent();
        }
        var wpnData = TWP2.WeaponDatabase.GetWeapon(viewable[i]["id"]);
        var bLocked = this.bLockItems ? wpnData["unlockLevel"] > TWP2.PlayerUtil.player["level"] : false;
        var lockString = "Unlocked at level " + wpnData["unlockLevel"];
        if (wpnData["bPrestige"] && this.bLockItems) {
          bLocked = !TWP2.PlayerUtil.IsPrestiged();
          lockString = "Unlocked after Prestige";
        }
        itemButton.setLocked(bLocked, lockString);
        itemButton.y = this.itemButtons.height + (i > 0 ? padding : 0);
        if (!bLocked) {
          itemButton.events.onInputOver.add(this.onItemButtonOver, this, 0, { type: "weapon", data: viewable[i], button: itemButton });
          itemButton.events.onInputOut.add(this.onWeaponButtonOut, this, 0);
        }
        if (this.bLockItems) {
          if (TWP2.PlayerUtil.IsPendingItem(viewable[i]["id"])) {
            itemButton.showNewIcon();
          }
        }
        this.itemButtons.add(itemButton);
      }
      /* Pages */
      var maxPages = Math.ceil(weapons.length / ItemSelector.MAX_ITEMS_PER_PAGE);
      var prevButton = new TWP2.MenuButton(this.itemButtons.width / 3, "center", undefined, 30);
      prevButton.setEnabled(_page > 0);
      prevButton.setCallback(this.loadWeaponCategory, this, [_type, _page - 1]);
      var desiredY = TWP2.ClassItemButton.BUTTON_HEIGHT * ItemSelector.MAX_ITEMS_PER_PAGE + padding * ItemSelector.MAX_ITEMS_PER_PAGE;
      prevButton.y = desiredY; //this.itemButtons.height + padding;
      var backArrow = this.game.add.image(0, 0, "atlas_ui", "icon_arrow");
      backArrow.scale.x = -1;
      prevButton.setIcon(backArrow, "center");
      this.itemButtons.add(prevButton);
      var pageText = this.game.add.text(0, 0, _page + 1 + " of " + maxPages, { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      pageText.setTextBounds(0, 2, this.itemButtons.width / 3, prevButton.height);
      //pageText.alpha = 0.5;
      pageText.x = prevButton.x + prevButton.width;
      pageText.y = prevButton.y;
      this.itemButtons.add(pageText);
      var nextButton = new TWP2.MenuButton(this.itemButtons.width / 3, "center", undefined, 30);
      nextButton.setEnabled(_page < maxPages - 1);
      nextButton.setCallback(this.loadWeaponCategory, this, [_type, _page + 1]);
      nextButton.x = pageText.x + pageText.textBounds.width;
      nextButton.y = prevButton.y;
      nextButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_arrow"), "center");
      this.itemButtons.add(nextButton);
    };
    ItemSelector.prototype.loadSkills = function (_page) {
      if (_page === void 0) {
        _page = 0;
      }
      this.itemButtons.removeAll(true);
      var skills = TWP2.SkillDatabase.GetAllSkills();
      var startIndex = _page * ItemSelector.MAX_ITEMS_PER_PAGE;
      var viewable = skills.slice(startIndex);
      for (var i = 0; i < Math.min(viewable.length, ItemSelector.MAX_ITEMS_PER_PAGE); i++) {
        var itemButton = new TWP2.ClassItemButton();
        itemButton.setCallback(this.onItemClicked, this, ["perk", viewable[i]["id"]]);
        itemButton.setSkill(viewable[i]);
        if (skills[i]["id"] == this.currentItemId) {
          itemButton.setAsCurrent();
        }
        var bLocked = skills[i]["unlockLevel"] > TWP2.PlayerUtil.player["level"];
        itemButton.setLocked(bLocked, "Unlocked at level " + viewable[i]["unlockLevel"]);
        itemButton.y = this.itemButtons.height + (i > 0 ? 4 : 0);
        if (!bLocked) {
          itemButton.events.onInputOver.add(this.onItemButtonOver, this, 0, { type: "perk", data: viewable[i], button: itemButton });
          itemButton.events.onInputOut.add(this.onWeaponButtonOut, this, 0);
        }
        if (this.bLockItems) {
          if (TWP2.PlayerUtil.IsPendingItem(viewable[i]["id"])) {
            itemButton.showNewIcon();
          }
        }
        this.itemButtons.add(itemButton);
      }
      var padding = 4;
      this.itemNameText.x = this.itemButtons.x + this.itemButtons.width + padding * 4;
      this.itemNameText.y = this.itemButtons.y;
      this.itemDescText.x = this.itemNameText.x;
      this.itemDescText.y = this.itemNameText.y + this.itemNameText.height;
    };
    ItemSelector.prototype.loadMods = function (_modType, _weaponId) {
      var mods;
      if (_modType == TWP2.WeaponDatabase.MOD_OPTIC) {
        mods = TWP2.WeaponDatabase.GetAllModsFor(TWP2.WeaponDatabase.MOD_OPTIC, _weaponId);
      } else if (_modType == TWP2.WeaponDatabase.MOD_MAG) {
        mods = TWP2.WeaponDatabase.GetAllModsFor(TWP2.WeaponDatabase.MOD_MAG, _weaponId);
      } else if (_modType == TWP2.WeaponDatabase.MOD_BARREL) {
        mods = TWP2.WeaponDatabase.GetAllModsFor(TWP2.WeaponDatabase.MOD_BARREL, _weaponId);
      } else if (_modType == TWP2.WeaponDatabase.MOD_BASE) {
        mods = TWP2.WeaponDatabase.GetAllModsFor(TWP2.WeaponDatabase.MOD_BASE, _weaponId);
      }
      for (var i = 0; i < mods.length; i++) {
        var bAvailable = TWP2.WeaponDatabase.CanHaveMod(_weaponId, mods[i]["id"]);
        if (bAvailable) {
          var itemButton = new TWP2.ClassItemButton();
          itemButton.setCallback(this.onItemClicked, this, ["mod", mods[i]["id"]]);
          itemButton.setMod(mods[i]);
          if (this.currentItemId) {
            if (mods[i]["id"] == this.currentItemId) {
              itemButton.setAsCurrent();
            }
          } else {
            if (TWP2.WeaponDatabase.IsDefaultMod(mods[i]["id"])) {
              itemButton.setAsCurrent();
            }
          }
          var modKey = mods[i]["unlockKills"] != undefined ? "unlockKills" : "unlockHeadshots";
          var weaponKey = modKey == "unlockKills" ? "kills" : "headshots";
          var bLocked = mods[i][modKey] > TWP2.PlayerUtil.player["weapons"][_weaponId][weaponKey];
          itemButton.setLocked(bLocked, "Unlocked after " + mods[i][modKey] + " " + (modKey == "unlockKills" ? "kills" : "headshots"));
          itemButton.y = this.itemButtons.height + (i > 0 ? 4 : 0);
          if (!bLocked) {
            itemButton.events.onInputOver.add(this.onItemButtonOver, this, 0, { type: "mod", data: mods[i], button: itemButton });
            itemButton.events.onInputOut.add(this.onWeaponButtonOut, this, 0);
          }
          if (this.bLockItems) {
            if (TWP2.PlayerUtil.IsPendingItem(mods[i]["id"])) {
              itemButton.showNewIcon();
            }
          }
          this.itemButtons.add(itemButton);
        }
      }
      var padding = 4;
      this.itemNameText.x = this.itemButtons.x + this.itemButtons.width + padding * 4;
      this.itemNameText.y = this.itemButtons.y;
      this.itemDescText.x = this.itemNameText.x;
      this.itemDescText.y = this.itemNameText.y + this.itemNameText.height;
    };
    ItemSelector.prototype.showItemImage = function () {
      if (this.itemImage) {
        var tween = this.game.add.tween(this.itemImage).from({ alpha: 0, x: this.itemImage.x + 60 }, 500, Phaser.Easing.Exponential.Out, true);
      }
    };
    ItemSelector.prototype.setWeapon = function (_data) {
      if (this.itemImage) {
        this.itemImage.destroy();
      }
      this.itemImage = TWP2.GameUtil.CreateWeapon(_data);
      if (this.itemImage) {
        this.itemNameText.setText(_data["name"], true);
        this.itemNameText.visible = true;
        this.itemDescText.setText(_data["desc"], true);
        this.itemDescText.visible = true;
        this.itemImage.x = this.itemDescText.x;
        var group = this.itemImage;
        var optic = group.getByName(TWP2.WeaponDatabase.MOD_OPTIC);
        this.itemImage.y = this.itemDescText.y + this.itemDescText.height + (optic ? 25 : 50);
        this.add(this.itemImage);
        this.showItemImage();
        this.weaponStats.setFromData(_data);
        this.weaponStats.x = this.itemNameText.x;
        this.weaponStats.y = 518 - this.weaponStats.height;
        this.weaponStats.visible = true;
        this.magContainer.visible = true;
        if (this.magText) {
          this.magText.setText(_data["magSize"].toString(), true);
        }
      }
    };
    ItemSelector.prototype.onCategoryClicked = function (_id, _button) {
      this.loadWeaponCategory(_id);
      this.updateButtons();
    };
    ItemSelector.prototype.onItemClicked = function (_type, _id) {
      if (TWP2.GameUtil.GetGameState()) {
        var char = TWP2.GameUtil.GetGameState().getPlayerPawn();
        char.replaceInventoryItem(TWP2.WeaponDatabase.GetWeapon(_id), 0);
        TWP2.GameUtil.GetGameState().setPaused(false);
      } else {
        this.onSelectWeapon(_id, true);
        /*
              if (PlayerUtil.HasInventoryWeapon(_id))
              {
                  this.onSelectWeapon(_id, true);
              }
              else
              {
                  var weapon = WeaponDatabase.GetWeapon(_id);
                  GameUtil.game.createWindow({
                      titleText: "Purchase: " + weapon["name"],
                      messageText: "Are you sure you want to purchase this weapon?",
                      image: ["atlas_weapons_icons", weapon["id"]],
                      type: Window.TYPE_PURCHASE,
                      bShowEquipButton: true,
                      cost: weapon["cost"],
                      buyCallback: this.onSelectWeapon,
                      buyCallbackContext: this,
                      buyCallbackParams: [_id, false],
                      equipCallbackParams: [_id, true]
                  });
              }
              */
      }
    };
    ItemSelector.prototype.onSelectWeapon = function (_id, _bEquip) {
      var classData = TWP2.PlayerUtil.player["loadouts"][this.currentClassIndex];
      console.log(classData[this.currentTypeSlot]);
      if (classData[this.currentTypeSlot]["id"] != _id) {
        classData[this.currentTypeSlot]["mods"][TWP2.WeaponDatabase.MOD_BASE] = TWP2.WeaponDatabase.BASE_DEFAULT;
        classData[this.currentTypeSlot]["mods"][TWP2.WeaponDatabase.MOD_OPTIC] = TWP2.WeaponDatabase.OPTIC_DEFAULT;
        classData[this.currentTypeSlot]["mods"][TWP2.WeaponDatabase.MOD_MAG] = TWP2.WeaponDatabase.MAG_DEFAULT;
        classData[this.currentTypeSlot]["mods"][TWP2.WeaponDatabase.MOD_BARREL] = TWP2.WeaponDatabase.BARREL_DEFAULT;
        classData[this.currentTypeSlot]["mods"][TWP2.WeaponDatabase.MOD_MUZZLE] = TWP2.WeaponDatabase.MUZZLE_DEFAULT;
        classData[this.currentTypeSlot]["mods"][TWP2.WeaponDatabase.MOD_BARREL] = TWP2.WeaponDatabase.BARREL_DEFAULT;
      }
      classData[this.currentTypeSlot]["id"] = _id;
      if (_bEquip) {
        TWP2.SoundManager.PlayUISound("wpn_deploy_firearm_" + TWP2.MathUtil.Random(1, 2), 0.5);
        var mainMenu = TWP2.GameUtil.game.getMainMenu();
        if (mainMenu) {
          var playMenu = mainMenu.getPlayMenu();
          if (playMenu) {
            playMenu.refreshLoadout();
          }
        }
        this.close();
      }
      TWP2.GameUtil.game.savePlayerData();
    };
    ItemSelector.prototype.close = function () {
      this.closeCallback.apply(this.closeCallbackContext);
    };
    ItemSelector.prototype.setWeaponInfo = function (_val) {
      this.weaponInfo = _val;
    };
    ItemSelector.prototype.onItemButtonOver = function (_arg1, _arg2, _data) {
      TWP2.SoundManager.PlayUISound("wpn_gear_" + TWP2.MathUtil.Random(1, 3), 0.1);
      if (_data["type"] == "weapon") {
        this.setWeapon(_data["data"]);
      }
      if (this.bLockItems) {
        TWP2.PlayerUtil.ClearPendingItemById(_data["data"]["id"]);
        if (_data["button"]) {
          _data["button"].hideNewIcon();
        }
        this.updateButtons();
      }
    };
    ItemSelector.prototype.onWeaponButtonOut = function (_arg1, _arg2) {
      if (this.itemImage) {
        this.itemImage.destroy();
      }
      this.magContainer.visible = false;
      this.weaponStats.visible = false;
      this.itemNameText.visible = false;
      this.itemDescText.visible = false;
      if (this.weaponInfo) {
        this.weaponInfo.setWeaponMod(null);
      }
    };
    ItemSelector.MAX_ITEMS_PER_PAGE = 5;
    return ItemSelector;
  })(Phaser.Group);
  TWP2.ItemSelector = ItemSelector;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var ModSelectMenu = /** @class */ (function (_super) {
    __extends(ModSelectMenu, _super);
    function ModSelectMenu(_data) {
      var _this = _super.call(this) || this;
      _this.data = _data;
      if (_this.data["loadoutIndex"] != undefined) {
        _this.loadoutItem = TWP2.PlayerUtil.GetLoadoutItem(_this.data["loadoutIndex"], _this.data["weaponIndex"]);
      } else {
        _this.loadoutItem = null;
      }
      if (_this.loadoutItem) {
        _this.weaponData = TWP2.WeaponDatabase.GetWeapon(_this.loadoutItem["id"]);
      } else {
        _this.weaponData = _this.data["weapon"];
      }
      var bg = _this.game.add.graphics();
      if (_this.data["bRange"] == true) {
        bg.beginFill(0xffffff, 0.2);
      } else {
        bg.beginFill(0x000000, 0.35);
      }
      bg.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.add(bg);
      var titleText = _this.game.add.text(0, 0, _this.weaponData["name"] + ": " + TWP2.WeaponDatabase.GetModString(_this.data["modType"]), { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(titleText);
      titleText.x = _this.width * 0.5 - titleText.width * 0.5;
      titleText.y = 10;
      _this.add(titleText);
      if (_this.loadoutItem) {
        var weaponStats = TWP2.PlayerUtil.player.weapons[_this.weaponData["id"]];
        var statsText = _this.game.add.text(0, 0, weaponStats["kills"] + " kills â€¢ " + weaponStats["headshots"] + " headshots", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        statsText.alpha = 0.5;
        statsText.x = _this.width * 0.5 - statsText.width * 0.5;
        statsText.y = titleText.y + titleText.height;
        _this.add(statsText);
        var moneyText = _this.game.add.text(0, 0, "$" + TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player.money), { font: "20px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING });
        moneyText.x = _this.width - moneyText.width - 10;
        moneyText.y = 10;
        _this.add(moneyText);
      }
      var highlight = _this.game.add.image(0, 0, "highlight");
      highlight.alpha = 0.35;
      highlight.x = _this.game.width * 0.5 - highlight.width * 0.5;
      highlight.y = 180 - highlight.height * 0.5;
      _this.add(highlight);
      _this.currentWeapon = TWP2.GameUtil.CreateWeapon(_this.weaponData);
      _this.currentWeapon.x = _this.game.width * 0.5 - _this.currentWeapon.width * 0.5;
      _this.currentWeapon.y = 180 - _this.currentWeapon.height * 0.5;
      _this.add(_this.currentWeapon);
      _this.gfx = _this.game.add.graphics();
      _this.add(_this.gfx);
      var tween = _this.game.add.tween(_this.currentWeapon).from({ x: 0 }, 350, Phaser.Easing.Exponential.Out, true);
      TWP2.SoundManager.PlayUISound("wpn_loadout_select_" + TWP2.MathUtil.Random(1, 3), 0.5);
      _this.modsContainer = _this.game.add.group();
      _this.modsContainer.y = 320;
      _this.add(_this.modsContainer);
      _this.loadMods(_this.data["modType"], _this.loadoutItem ? _this.loadoutItem["id"] : _this.weaponData["id"]);
      _this.modInfo = new ModInfo();
      _this.modInfo.x = _this.width * 0.5 - _this.modInfo.width * 0.5;
      _this.modInfo.y = _this.modsContainer.y + _this.modsContainer.height + 20;
      _this.add(_this.modInfo);
      _this.onButtonOut();
      return _this;
    }
    ModSelectMenu.prototype.destroy = function () {
      this.data = null;
      this.currentWeapon = null;
      this.modsContainer = null;
      this.modInfo = null;
      _super.prototype.destroy.call(this);
    };
    ModSelectMenu.prototype.drawLine = function (_x, _y) {
      this.clearLine();
      if (this.currentWeapon) {
        var modPosition = new Phaser.Point(this.currentWeapon.x, this.currentWeapon.y);
        var child = this.currentWeapon.getByName(this.data["modType"]);
        if (!child) {
          child = this.currentWeapon.getByName(this.data["id"]);
        }
        if (child && this.data["modType"] != TWP2.WeaponDatabase.MOD_BASE) {
          modPosition.x += child.x;
          modPosition.y += child.y;
          console.log(this.data["modType"]);
          if (this.data["modType"] == TWP2.WeaponDatabase.MOD_OPTIC) {
            modPosition.x += child.width * 0.5;
            modPosition.y += child.height;
          } else if (this.data["modType"] == TWP2.WeaponDatabase.MOD_MAG) {
            modPosition.x += child.width * 0.5;
            modPosition.y += child.height * 0.5;
          }
          this.gfx.beginFill(0xffffff, 0.8);
          this.gfx.drawCircle(modPosition.x, modPosition.y, 6);
          this.gfx.endFill();
          this.gfx.lineStyle(2, 0xffffff, 0.15);
          this.gfx.moveTo(_x, _y);
          this.gfx.lineTo(modPosition.x, modPosition.y);
        }
      }
    };
    ModSelectMenu.prototype.clearLine = function () {
      this.gfx.clear();
    };
    ModSelectMenu.prototype.loadMods = function (_modType, _weaponId) {
      this.modsContainer.removeAll(true);
      this.modType = _modType;
      var mods = TWP2.WeaponDatabase.GetAllModsFor(_modType, _weaponId);
      var loadout;
      if (this.loadoutItem) {
        loadout = TWP2.PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
      } else {
        var weapon = this.data["weapon"];
        loadout = {
          mods: {
            base: weapon["baseMod"],
            optic: weapon["optic"],
            mag: weapon["magMod"],
            barrel: weapon["barrel"],
            muzzle: weapon["muzzleMod"],
          },
        };
      }
      for (var i = 0; i < mods.length; i++) {
        var bDefaultMod = TWP2.WeaponDatabase.IsDefaultMod(mods[i]["id"]);
        var bModLocked = this.data["bRange"] ? false : TWP2.PlayerUtil.GetModLockedStatus(mods[i]["id"], _weaponId);
        var bModOwned = this.data["bRange"] ? true : TWP2.PlayerUtil.HasInventoryMod(_weaponId, mods[i]["id"]);
        var bModCurrent = false;
        if (this.data["bRange"]) {
          var trueModString = TWP2.WeaponDatabase.GetTrueModTypeString(_modType);
          if (bDefaultMod) {
            bModCurrent = !this.data["weapon"][trueModString] || this.data["weapon"][trueModString] == mods[i]["id"];
          } else {
            bModCurrent = this.data["weapon"][trueModString] == mods[i]["id"];
          }
        } else {
          bModCurrent = loadout["mods"][_modType] == mods[i]["id"];
        }
        var but = new TWP2.ModButton();
        but.setCallback(this.onModClicked, this, [mods[i]]);
        but.setMod(mods[i]);
        but.setOwned(bModOwned);
        but.setCurrent(bModCurrent);
        if (!bModOwned) {
          but.setLocked(bModLocked);
        }
        if (this.data["bRange"]) {
          but.setUnlockBarValue(1);
        } else {
          but.setUnlockBarValue(TWP2.PlayerUtil.GetModUnlockPercent(mods[i]["id"], _weaponId));
          if (bDefaultMod) {
            //but.setUnlockBarVisible(false);
            but.setUnlockBarValue(1);
          }
        }
        but.setNewIconVisible(TWP2.PlayerUtil.HasPendingMod(mods[i]["id"], loadout["id"]));
        but.x = this.modsContainer.width + (i > 0 ? 4 : 0);
        this.modsContainer.add(but);
        but.events.onInputOver.add(this.onButtonOver, this, 0, but, mods[i], _weaponId, bModOwned ? false : bModLocked);
        but.events.onInputOut.add(this.onButtonOut, this, 0);
        TWP2.PlayerUtil.ClearPendingModById(mods[i]["id"], _weaponId);
      }
      this.modsContainer.x = this.width * 0.5 - this.modsContainer.width * 0.5;
    };
    ModSelectMenu.prototype.onButtonOver = function (_arg1, _arg2, _button, _data, _weaponId, _bLocked) {
      this.modInfo.setMod(_data, _weaponId, _bLocked);
      _button.setNewIconVisible(false);
      TWP2.SoundManager.PlayUISound("wpn_gear_" + TWP2.MathUtil.Random(1, 3), 0.1);
      //this.drawLine(_button.parent.x + _button.x + (_button.width * 0.5), _button.parent.y + _button.y);
      if (this.currentWeapon) {
        if (this.modType == TWP2.WeaponDatabase.MOD_BASE || this.modType == TWP2.WeaponDatabase.MOD_MAG) {
          return;
        }
        var child = this.currentWeapon.getByName(this.modType);
        if (!child) {
          child = this.currentWeapon.getByName(_data["id"]);
        }
        if (child) {
          child.visible = true;
          var useId = this.getModUseId(_weaponId, _data);
          child.frameName = useId;
        }
      }
    };
    ModSelectMenu.prototype.getModUseId = function (_weaponId, _data) {
      var useId = _data["id"];
      if (_data["id"] == TWP2.WeaponDatabase.BARREL_M203 || _data["id"] == TWP2.WeaponDatabase.BARREL_MASTERKEY) {
        var weaponData = TWP2.WeaponDatabase.GetWeapon(_weaponId);
        if (weaponData["bSmallM203"] == true) {
          useId = _data["id"] == TWP2.WeaponDatabase.BARREL_M203 ? TWP2.WeaponDatabase.BARREL_M203_SMALL : TWP2.WeaponDatabase.BARREL_MASTERKEY_SMALL;
        }
      } else if (_data["id"] == TWP2.WeaponDatabase.BARREL_LASER) {
        var weaponData = TWP2.WeaponDatabase.GetWeapon(_weaponId);
        if (weaponData["bSmallLaser"] == true) {
          useId = TWP2.WeaponDatabase.BARREL_LASER_SMALL;
        }
      } else if (_data["id"] == TWP2.WeaponDatabase.BARREL_GRIP) {
        var weaponData = TWP2.WeaponDatabase.GetWeapon(_weaponId);
        if (weaponData["bSmallGrip"] == true) {
          useId = TWP2.WeaponDatabase.BARREL_GRIP_SMALL;
        }
      } else if (_data["id"] == TWP2.WeaponDatabase.BARREL_BIPOD) {
        var weaponData = TWP2.WeaponDatabase.GetWeapon(_weaponId);
      }
      return useId;
    };
    ModSelectMenu.prototype.onButtonOut = function () {
      this.modInfo.setMod(null, null, false);
      if (this.currentWeapon) {
        var child = this.currentWeapon.getByName(this.modType);
        if (child) {
          child.frameName = TWP2.WeaponDatabase.GetDefaultModForModType(this.modType);
        } else {
          for (var i = 0; i < this.currentWeapon.children.length; i++) {
            var cur = this.currentWeapon.getAt(i);
            if (cur) {
              if (cur.name) {
                if (TWP2.WeaponDatabase.IsModType(cur.name, TWP2.WeaponDatabase.MOD_BARREL)) {
                  cur.visible = false;
                }
              }
            }
          }
        }
      }
      //this.clearLine();
    };
    ModSelectMenu.prototype.onModClicked = function (_mod) {
      if (this.data["bRange"] == true) {
        var modString = _mod["type"];
        if (modString == "mag" || modString == "muzzle" || modString == "base") {
          modString += "Mod";
        }
        this.data["weapon"][modString] = _mod["id"];
        var char = TWP2.GameUtil.GetGameState().getPlayerPawn();
        char.refreshCurrentItem();
        this.close();
        if (this.data["window"]) {
          var win = this.data["window"];
          this.data["weapon"] = char.getCurrentInventoryItem();
          win.updateMods(this.data["weapon"]);
        }
      } else {
        var bOwned = TWP2.PlayerUtil.HasInventoryMod(this.loadoutItem["id"], _mod["id"]);
        var weapon = TWP2.WeaponDatabase.GetWeapon(this.loadoutItem["id"]);
        if (bOwned) {
          this.loadoutItem["mods"][_mod["type"]] = _mod["id"];
          TWP2.GameUtil.game.getMainMenu().getPlayMenu().refreshLoadout();
          TWP2.GameUtil.game.savePlayerData();
          this.close();
        } else {
          TWP2.GameUtil.game.createWindow({
            titleText: weapon["name"] + ": " + _mod["name"],
            messageText: "Are you sure you want to purchase this mod?",
            cost: _mod["cost"],
            type: TWP2.Window.TYPE_PURCHASE,
            image: ["atlas_ui", _mod["id"]],
            bShowEquipButton: true,
            buyCallback: this.onBuyMod,
            buyCallbackContext: this,
            buyCallbackParams: [this.loadoutItem["id"], _mod["id"], false],
            equipCallbackParams: [this.loadoutItem["id"], _mod["id"], true],
          });
        }
      }
    };
    ModSelectMenu.prototype.onBuyMod = function (_weaponId, _modId, _bEquip) {
      TWP2.PlayerUtil.AddModToInventory(_weaponId, _modId);
      var mod = TWP2.WeaponDatabase.GetMod(_modId);
      if (_bEquip) {
        this.loadoutItem["mods"][mod["type"]] = _modId;
        TWP2.GameUtil.game.getMainMenu().getPlayMenu().refreshLoadout();
        TWP2.GameUtil.game.savePlayerData();
        this.close();
      } else {
        this.loadMods(mod["type"], this.loadoutItem["id"]);
      }
    };
    ModSelectMenu.prototype.close = function () {
      _super.prototype.close.call(this);
      TWP2.SoundManager.PlayUISound("wpn_equip", 0.5);
    };
    return ModSelectMenu;
  })(TWP2.ElementBase);
  TWP2.ModSelectMenu = ModSelectMenu;
  var ModInfo = /** @class */ (function (_super) {
    __extends(ModInfo, _super);
    function ModInfo() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0xffffff, 0.01);
      bg.drawRect(0, 0, 800, 120);
      _this.add(bg);
      _this.nameText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      TWP2.GameUtil.SetTextShadow(_this.nameText);
      _this.nameText.setTextBounds(0, 0, _this.width, 20);
      _this.add(_this.nameText);
      _this.descText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
      _this.descText.setTextBounds(0, 0, _this.width, 20);
      _this.descText.y = _this.nameText.height;
      _this.add(_this.descText);
      _this.infoText = _this.game.add.text(0, 0, "", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_RED_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
      _this.infoText.setTextBounds(0, 0, _this.width, 20);
      _this.infoText.y = _this.descText.y + _this.descText.height + 12;
      _this.add(_this.infoText);
      return _this;
    }
    ModInfo.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    ModInfo.prototype.setMod = function (_data, _weaponId, _bLocked) {
      if (_data) {
        var weapon = TWP2.WeaponDatabase.GetWeapon(_weaponId);
        this.nameText.setText(_data["name"], true);
        this.descText.setText(_data["desc"], true);
        if (_bLocked) {
          var str = "Get ";
          if (_data["unlockKills"] != undefined) {
            str += TWP2.GameUtil.FormatNum(_data["unlockKills"]) + " kills ";
          } else if (_data["unlockHeadshots"] != undefined) {
            str += TWP2.GameUtil.FormatNum(_data["unlockHeadshots"]) + " headshots ";
          }
          str += "with " + weapon["name"] + " to unlock";
          this.infoText.setText(str, true);
        } else {
          this.infoText.setText("", true);
        }
      } else {
        this.nameText.setText("", true);
        this.descText.setText("", true);
        this.infoText.setText("", true);
      }
    };
    return ModInfo;
  })(Phaser.Group);
  TWP2.ModInfo = ModInfo;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var PlayMenu = /** @class */ (function (_super) {
    __extends(PlayMenu, _super);
    function PlayMenu() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.profileWidget = new TWP2.ProfileWidget();
      _this.profileWidget.x = _this.game.width - _this.profileWidget.width - 4;
      _this.profileWidget.y = 4;
      _this.add(_this.profileWidget);
      var tabs = _this.game.add.group();
      var tabPadding = 4;
      var backButton = new TWP2.BasicButton("icon_back");
      backButton.setCallback(TWP2.GameUtil.game.getMainMenu().loadMenu, TWP2.GameUtil.game.getMainMenu(), [TWP2.MainMenu.MENU_MAIN]);
      tabs.add(backButton);
      _this.gamesButton = new TWP2.TabButton();
      _this.gamesButton.setCallback(_this.setMenu, _this, [PlayMenu.MENU_GAMES]);
      _this.gamesButton.setLabelText("Play");
      _this.gamesButton.setIcon("atlas_ui", "icon_play");
      _this.gamesButton.x = tabs.width + tabPadding;
      tabs.add(_this.gamesButton);
      _this.loadoutsButton = new TWP2.TabButton();
      _this.loadoutsButton.setCallback(_this.setMenu, _this, [PlayMenu.MENU_LOADOUTS]);
      _this.loadoutsButton.setLabelText("Loadouts");
      _this.loadoutsButton.setIcon("atlas_weapons_icons_small", TWP2.WeaponDatabase.WEAPON_M9);
      _this.loadoutsButton.x = tabs.width + tabPadding;
      tabs.add(_this.loadoutsButton);
      _this.skillsButton = new TWP2.TabButton();
      _this.skillsButton.setCallback(_this.setMenu, _this, [PlayMenu.MENU_SKILLS]);
      _this.skillsButton.setLabelText("Skills");
      _this.skillsButton.setIcon("atlas_ui", "icon_skills");
      _this.skillsButton.x = tabs.width + tabPadding;
      tabs.add(_this.skillsButton);
      _this.profileButton = new TWP2.TabButton();
      _this.profileButton.setCallback(_this.setMenu, _this, [PlayMenu.MENU_PROFILE]);
      _this.profileButton.setLabelText("Profile");
      _this.profileButton.setIcon("atlas_ui", "icon_profile_small");
      _this.profileButton.x = tabs.width + tabPadding;
      tabs.add(_this.profileButton);
      tabs.x = tabPadding;
      tabs.y = tabPadding;
      _this.add(tabs);
      _this.tabButtons = [_this.gamesButton, _this.loadoutsButton, _this.skillsButton, _this.profileButton];
      _this.container = _this.game.add.group();
      _this.container.x = tabs.x;
      _this.container.y = tabs.y + tabs.height + 10;
      _this.add(_this.container);
      _this.setMenu(PlayMenu.MENU_GAMES);
      if (TWP2.PlayerUtil.HasNewUnlocks()) {
        TWP2.GameUtil.game.createWindow({
          type: TWP2.Window.TYPE_NEW_UNLOCKS,
          titleText: "New Unlocks",
          messageText: "You've unlocked new items! They are now available for use in your loadouts.",
        });
      }
      return _this;
    }
    PlayMenu.prototype.destroy = function () {
      this.tabButtons = null;
      this.container = null;
      this.containerTween = null;
      _super.prototype.destroy.call(this);
    };
    PlayMenu.prototype.updateWidget = function () {
      this.profileWidget.updateInfo();
    };
    PlayMenu.prototype.refreshLoadout = function () {
      this.selectLoadout(this.loadoutContainer.getCurrentLoadoutIndex(), this.loadoutContainer.getCurrentWeaponIndex());
      this.refreshNewIcons();
    };
    PlayMenu.prototype.refreshProfile = function () {
      this.setMenu(PlayMenu.MENU_PROFILE);
    };
    PlayMenu.prototype.refreshNewIcons = function () {
      var bPendingNewItems = TWP2.PlayerUtil.IsPendingNewItems();
      this.loadoutsButton.setNewIconVisible(bPendingNewItems);
      if (this.loadoutContainer) {
        this.loadoutContainer.setClearNewUnlocksButtonVisible(bPendingNewItems);
      }
      this.skillsButton.setNewIconVisible(TWP2.PlayerUtil.HasSkillPoint());
      this.profileButton.setNewIconVisible(TWP2.PlayerUtil.CanPrestige());
      if (this.loadoutButtons) {
        for (var i = 0; i < this.loadoutButtons.length; i++) {
          var but = this.loadoutButtons[i];
          if (but) {
            var loadout = but.getButtonData();
            but.setIcon(null);
            if (loadout) {
              if (TWP2.PlayerUtil.HasPendingModsForWeapon(loadout["primary"]["id"]) || TWP2.PlayerUtil.HasPendingModsForWeapon(loadout["secondary"]["id"])) {
                var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
                but.setIcon(newIcon);
              } else {
                but.setIcon(null);
              }
            }
          }
        }
      }
    };
    PlayMenu.prototype.setMenu = function (_id) {
      this.container.removeAll(true);
      if (_id == PlayMenu.MENU_GAMES) {
        this.setButtonSelected(this.gamesButton);
        this.modeContainer = new ModeContainer();
        this.container.add(this.modeContainer);
      } else if (_id == PlayMenu.MENU_LOADOUTS) {
        this.setButtonSelected(this.loadoutsButton);
        this.loadoutButtonsContainer = this.game.add.group();
        this.container.add(this.loadoutButtonsContainer);
        /*
              var rangeButton = new MenuButton(undefined, undefined, ColourUtil.COLOUR_GREEN);
              rangeButton.setLabelText("Firing Range");
              rangeButton.setCallback(GameUtil.game.prepareGame, GameUtil.game, [{ gameMode: GameModeDatabase.GAME_RANGE }]);
              rangeButton.x = (this.game.width * 0.5) - (rangeButton.width * 0.5) - (this.container.x);
              rangeButton.y = 0;
              this.container.add(rangeButton);
              */
        this.createLoadoutButtons();
        this.loadoutContainer = new LoadoutContainer();
        this.loadoutContainer.y = this.loadoutButtonsContainer.y + this.loadoutButtonsContainer.height + 10;
        this.container.add(this.loadoutContainer);
        this.selectLoadout(TWP2.PlayerUtil.player["lastLoadoutIndex"], TWP2.PlayerUtil.player["lastLoadoutWeapon"]);
      } else if (_id == PlayMenu.MENU_SKILLS) {
        this.setButtonSelected(this.skillsButton);
        this.skillsContainer = new SkillsContainer();
        this.container.add(this.skillsContainer);
      } else if (_id == PlayMenu.MENU_PROFILE) {
        this.setButtonSelected(this.profileButton);
        var rankContainer = this.game.add.group();
        var mainLevelNum = TWP2.PlayerUtil.player["level"];
        var nextLevelNum = mainLevelNum + 1;
        if (mainLevelNum == TWP2.PlayerUtil.MAX_RANK) {
          nextLevelNum = mainLevelNum;
          mainLevelNum--;
        }
        var levelText = this.game.add.text(0, 0, mainLevelNum, { font: "52px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        rankContainer.add(levelText);
        var xpBar = new TWP2.UIBar({
          w: 580,
          h: 4,
          barColour: TWP2.ColourUtil.COLOUR_XP,
          blocks: 6,
          value: TWP2.PlayerUtil.GetCurrentXPPercent(),
        });
        xpBar.x = levelText.x + levelText.width + 10;
        xpBar.y = levelText.y + levelText.height * 0.5 - xpBar.height * 0.5;
        rankContainer.add(xpBar);
        var nextLevelText = this.game.add.text(0, 0, nextLevelNum, { font: "52px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        nextLevelText.x = xpBar.x + xpBar.width + 10;
        nextLevelText.y = levelText.y;
        rankContainer.add(nextLevelText);
        var xpText = this.game.add.text(0, 0, TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player["xp"]) + "XP", { font: "18px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
        xpText.x = xpBar.x + xpBar.width * 0.5 - xpText.width * 0.5;
        xpText.y = xpBar.y + xpBar.height + 8;
        rankContainer.add(xpText);
        rankContainer.x = this.game.width * 0.5 - rankContainer.width * 0.5;
        this.container.add(rankContainer);
        var profButtons = this.game.add.group();
        var prestigeButton = new TWP2.MenuButton(250, undefined, TWP2.ColourUtil.COLOUR_GREEN);
        if (!TWP2.PlayerUtil.IsPrestiged()) {
          if (TWP2.PlayerUtil.IsMaxLevel()) {
            prestigeButton.setLabelText("Prestige");
            var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
            newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
            prestigeButton.setIcon(newIcon);
            prestigeButton.setCallback(TWP2.GameUtil.game.createWindow, TWP2.GameUtil.game, [
              {
                type: TWP2.Window.TYPE_YES_NO,
                titleText: "Prestige",
                icon: "icon_prestige",
                iconTint: TWP2.ColourUtil.COLOUR_XP,
                messageText: "Prestiging will reset your rank, XP, and unlocks.\n\nNew weapons and equipment will be unlocked.\n\nAre you sure you want to prestige?",
                yesCallback: TWP2.PlayerUtil.AddPrestige,
                yesCallbackContext: TWP2.PlayerUtil,
              },
            ]);
          } else {
            prestigeButton.setLabelText("Prestige (unlocked at level " + TWP2.PlayerUtil.MAX_RANK + ")");
            prestigeButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_lock"));
            prestigeButton.setEnabled(false);
          }
        } else {
          prestigeButton.setLabelText("Prestiged");
          prestigeButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_checkmark"));
          prestigeButton.setEnabled(false);
        }
        profButtons.add(prestigeButton);
        if (TWP2.GameUtil.AdsEnabled()) {
          var adButton = new TWP2.MenuButton(250);
          adButton.setCallback(TWP2.AdUtil.ViewAd, TWP2.AdUtil);
          adButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_buy"));
          adButton.setLabelText("View Ad");
          adButton.x = profButtons.width + 4;
          profButtons.add(adButton);
          var date1 = TWP2.PlayerUtil.player.adDate;
          var date2 = new Date();
          if (date1 instanceof Date) {
            var diffTime = Math.abs(date2.getTime() - date1.getTime());
            var minutes = Math.floor(diffTime / 60000);
            var minCooldown = 5;
            if (minutes < minCooldown) {
              adButton.setEnabled(false);
              var minutesLeft = minCooldown - minutes;
              adButton.setLabelText("View Ad (available in " + minutesLeft + " minute" + TWP2.GameUtil.CheckPlural(minutesLeft) + ")");
              adButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_lock"));
            }
          }
        }
        profButtons.x = this.game.width * 0.5 - profButtons.width * 0.5;
        profButtons.y = this.container.height + 4;
        this.container.add(profButtons);
        var favContainer = this.game.add.group();
        var favWidth = 400;
        var favWeaponId = TWP2.PlayerUtil.GetFavouriteWeapon();
        var favWeaponData = TWP2.WeaponDatabase.GetWeapon(favWeaponId);
        var favText = this.game.add.text(0, 0, "Favorite Weapon: " + (favWeaponId ? favWeaponData["name"] : "N/A"), { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        TWP2.GameUtil.SetTextShadow(favText);
        favText.setTextBounds(0, 0, favWidth, 20);
        favContainer.add(favText);
        var favImage = this.game.add.image(0, 0, "atlas_weapons_icons_small", favWeaponId ? favWeaponId : TWP2.WeaponDatabase.WEAPON_M9);
        if (!favWeaponId) {
          favImage.alpha = 0.2;
        }
        favImage.anchor.set(0.5, 0.5);
        favImage.x = favWidth * 0.5;
        favImage.y = favContainer.height + 15;
        favContainer.add(favImage);
        var favKillsText = this.game.add.text(
          0,
          0,
          favWeaponId
            ? TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player.weapons[favWeaponId]["kills"]) + " kills â€¢ " + TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player.weapons[favWeaponId]["headshots"]) + " headshots"
            : "No weapons used yet",
          { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" }
        );
        favKillsText.setTextBounds(0, 0, favWidth, 20);
        favKillsText.alpha = 0.5;
        favKillsText.y = favImage.y + 25; //favContainer.height + 4;
        favContainer.add(favKillsText);
        favContainer.x = this.width * 0.5 - favWidth * 0.5;
        favContainer.y = this.container.height + 20;
        this.container.add(favContainer);
        var overviewText = this.game.add.text(0, 0, "Overview", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        TWP2.GameUtil.SetTextShadow(overviewText);
        overviewText.x = this.game.width * 0.5 - overviewText.width * 0.5;
        overviewText.y = this.container.height + 20;
        this.container.add(overviewText);
        var statPadding = 4;
        var statContainer = this.game.add.group();
        var gamesItem = new TWP2.ProfileStat("Games Played", TWP2.PlayerUtil.player.stats["games"]);
        statContainer.add(gamesItem);
        var killsItem = new TWP2.ProfileStat("Kills", TWP2.PlayerUtil.player.stats["kills"]);
        killsItem.x = statContainer.width + statPadding;
        statContainer.add(killsItem);
        var headshotsItem = new TWP2.ProfileStat("Headshots", TWP2.PlayerUtil.player.stats["headshots"]);
        headshotsItem.x = statContainer.width + statPadding;
        statContainer.add(headshotsItem);
        var shotsFiredItem = new TWP2.ProfileStat("Shots Fired", TWP2.PlayerUtil.player.stats["shotsFired"]);
        shotsFiredItem.x = statContainer.width + statPadding;
        statContainer.add(shotsFiredItem);
        var accuracyItem = new TWP2.ProfileStat("Accuracy", (TWP2.PlayerUtil.GetPlayerAccuracy() * 100).toFixed(2) + "%");
        accuracyItem.x = statContainer.width + statPadding;
        statContainer.add(accuracyItem);
        statContainer.x = this.game.width * 0.5 - statContainer.width * 0.5;
        statContainer.y = this.container.height + 4;
        this.container.add(statContainer);
        var achievementsText = this.game.add.text(0, 0, "Achievements", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
        TWP2.GameUtil.SetTextShadow(achievementsText);
        achievementsText.x = this.game.width * 0.5 - achievementsText.width * 0.5;
        achievementsText.y = this.container.height + 30;
        this.container.add(achievementsText);
        var achievementDescText = this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
        achievementDescText.setTextBounds(0, 0, this.game.width * 0.8, 20);
        this.container.add(achievementDescText);
        var ach = TWP2.Achievements.GetAll();
        var achContainer = this.game.add.group();
        for (var i = 0; i < ach.length; i++) {
          var bHasAchievement = TWP2.PlayerUtil.HasAchievement(ach[i]["id"]);
          var but = new TWP2.AchievementButton();
          but.setAchievement(ach[i]);
          but.setUnlocked(bHasAchievement);
          if (bHasAchievement) {
            TWP2.APIUtil.UnlockAchievement(ach[i]["id"]);
          }
          but.x = achContainer.width + (i > 0 ? 4 : 0);
          achContainer.add(but);
          but.events.onInputOver.add(TWP2.GameUtil.OnOverSetText, this, 0, achievementDescText, ach[i]["desc"]);
          but.events.onInputOut.add(TWP2.GameUtil.OnOutClearText, this, 0, achievementDescText);
        }
        achContainer.x = this.game.width * 0.5 - achContainer.width * 0.5 - 4;
        achContainer.y = this.container.height + 4;
        this.container.add(achContainer);
        achievementDescText.x = this.game.width * 0.5 - achievementDescText.textBounds.width * 0.5;
        achievementDescText.y = achContainer.y + achContainer.height + 12;
      }
      this.container.alpha = 0;
      if (this.containerTween) {
        this.containerTween.stop();
      }
      this.containerTween = this.game.add.tween(this.container).to({ alpha: 1 }, 300, Phaser.Easing.Exponential.Out, true);
      this.refreshNewIcons();
    };
    PlayMenu.prototype.createLoadoutButtons = function () {
      this.loadoutButtonsContainer.removeAll(true);
      this.loadoutButtons = [];
      for (var i = 0; i < TWP2.PlayerUtil.player.loadouts.length; i++) {
        var but = new TWP2.MenuButton(194.1);
        but.setButtonData(TWP2.PlayerUtil.player.loadouts[i]);
        but.setFullAlphaWhenSelected(true);
        but.setLabelText(TWP2.PlayerUtil.player.loadouts[i]["name"]);
        but.setCallback(this.selectLoadout, this, [i]);
        but.x = this.loadoutButtonsContainer.width + (i > 0 ? 4 : 0);
        this.loadoutButtonsContainer.add(but);
        this.loadoutButtons.push(but);
        if (this.loadoutContainer) {
          var loadoutIndex = this.loadoutContainer.getCurrentLoadoutIndex();
          if (i == loadoutIndex) {
            but.setSelected(true);
          }
        }
      }
      /*
          if (PlayerUtil.player.loadouts.length < 5)
          {
              var but = new LoadoutButton();
              but.setCallback(GameUtil.game.createWindow, GameUtil.game, [{
                  titleText: "Loadout Slot",
                  messageText: "Are you sure you want to purchase a new loadout slot?",
                  cost: 500,
                  type: Window.TYPE_PURCHASE,
                  buyCallback: this.onBuyLoadout,
                  buyCallbackContext: this,
                  buyCallbackParams: []
              }]);
              but.setPlusVisible(true);
              but.x = this.loadoutButtonsContainer.width + 4;
              this.loadoutButtonsContainer.add(but);
          }
          */
    };
    PlayMenu.prototype.onBuyLoadout = function () {
      TWP2.PlayerUtil.AddNewLoadout();
      this.createLoadoutButtons();
    };
    PlayMenu.prototype.selectLoadout = function (_num, _weaponIndex) {
      if (_weaponIndex === void 0) {
        _weaponIndex = 0;
      }
      TWP2.PlayerUtil.player["lastLoadoutIndex"] = _num;
      TWP2.PlayerUtil.player["lastLoadoutWeapon"] = _weaponIndex;
      for (var i = 0; i < this.loadoutButtons.length; i++) {
        this.loadoutButtons[i].setSelected(i == _num);
      }
      var loadoutData = TWP2.PlayerUtil.player.loadouts[_num];
      if (loadoutData) {
        this.loadoutContainer.setFromData(loadoutData);
        this.loadoutContainer.setCurrentLoadoutIndex(_num);
        this.loadoutContainer.select(_weaponIndex);
      }
    };
    PlayMenu.prototype.setButtonSelected = function (_val) {
      for (var i = 0; i < this.tabButtons.length; i++) {
        this.tabButtons[i].setSelected(this.tabButtons[i] == _val);
      }
    };
    PlayMenu.MENU_GAMES = "MENU_GAMES";
    PlayMenu.MENU_LOADOUTS = "MENU_LOADOUTS";
    PlayMenu.MENU_SKILLS = "MENU_SKILLS";
    PlayMenu.MENU_PROFILE = "MENU_PROFILE";
    return PlayMenu;
  })(Phaser.Group);
  TWP2.PlayMenu = PlayMenu;
  var SkillsContainer = /** @class */ (function (_super) {
    __extends(SkillsContainer, _super);
    function SkillsContainer() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var skills = TWP2.SkillDatabase.GetAllSkills();
      var leftContainer = _this.game.add.group();
      _this.skillBranches = [];
      for (var i = 0; i < skills.length; i++) {
        var skill = new TWP2.SkillBranch(_this.onAddSkill, _this);
        skill.setSkill(skills[i]);
        skill.y = i * (skill.height + (i > 0 ? 4 : 0));
        leftContainer.add(skill);
        _this.skillBranches.push(skill);
      }
      _this.add(leftContainer);
      var rightContainer = _this.game.add.group();
      var bg = _this.game.add.graphics();
      bg.beginFill(0xffffff, 0.1);
      bg.drawRoundedRect(0, 0, 200, 120, TWP2.GameUtil.RECT_RADIUS);
      rightContainer.add(bg);
      var infoButton = new TWP2.ImageButton("atlas_ui", "icon_help");
      infoButton.setCallback(TWP2.GameUtil.game.createWindow, TWP2.GameUtil.game, [
        {
          type: TWP2.Window.TYPE_MESSAGE,
          titleText: "Skills",
          messageText: "Use skill points to upgrade skills to improve your performance!\n\nEarn skill points by ranking up in game.",
          bShowOkayButton: true,
        },
      ]);
      infoButton.x = bg.width - infoButton.width - 4;
      infoButton.y = 4;
      rightContainer.add(infoButton);
      _this.pointsText = _this.game.add.text(0, 0, "", { font: "72px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      //GameUtil.SetTextShadow(this.pointsText);
      _this.pointsText.setTextBounds(0, 0, bg.width, 50);
      _this.pointsText.y = 12;
      rightContainer.add(_this.pointsText);
      _this.descText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      _this.descText.setTextBounds(0, 0, bg.width, 20);
      _this.descText.y = _this.pointsText.y + _this.pointsText.height;
      rightContainer.add(_this.descText);
      rightContainer.x = leftContainer.x + leftContainer.width + 70;
      rightContainer.y = leftContainer.height * 0.5 - rightContainer.height * 0.5;
      _this.add(rightContainer);
      _this.updateAll();
      return _this;
    }
    SkillsContainer.prototype.destroy = function () {
      _super.prototype.destroy.call(this);
    };
    SkillsContainer.prototype.onAddSkill = function (_id) {
      TWP2.SoundManager.PlayUISound("ui_unlock_item", 0.5);
      TWP2.PlayerUtil.AddSkill(_id);
      this.updateAll();
      for (var i = 0; i < this.skillBranches.length; i++) {
        var branch = this.skillBranches[i];
        if (branch.getSkillId() == _id) {
          branch.animate();
          break;
        }
      }
      TWP2.GameUtil.game.getMainMenu().getPlayMenu().refreshNewIcons();
    };
    SkillsContainer.prototype.updateAll = function () {
      var skillPoints = TWP2.PlayerUtil.player["skillPoints"];
      this.pointsText.setText(skillPoints.toString(), true);
      this.pointsText.addColor(skillPoints > 0 ? TWP2.ColourUtil.COLOUR_GREEN_STRING : TWP2.ColourUtil.COLOUR_RED_STRING, 0);
      this.pointsText.alpha = skillPoints > 0 ? 1 : 0.8;
      this.descText.setText("Skill Point" + (skillPoints == 1 ? "" : "s") + " Available");
      for (var i = 0; i < this.skillBranches.length; i++) {
        var branch = this.skillBranches[i];
        var curSkillValue = TWP2.PlayerUtil.GetSkillValue(branch.getSkillId());
        branch.setSkillValue(curSkillValue);
        branch.setAddButtonEnabled(skillPoints > 0 && curSkillValue < TWP2.PlayerUtil.MAX_SKILLS);
      }
    };
    return SkillsContainer;
  })(Phaser.Group);
  TWP2.SkillsContainer = SkillsContainer;
  var ModeContainer = /** @class */ (function (_super) {
    __extends(ModeContainer, _super);
    function ModeContainer() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.butContainer = _this.game.add.group();
      var modes = TWP2.GameModeDatabase.GetAllRankedGameModes();
      var curX = 0;
      var curY = 0;
      for (var i = 0; i < modes.length; i++) {
        var modeBut = new TWP2.GameModeButton();
        modeBut.setGameMode(modes[i]);
        modeBut.setCallback(_this.setGameMode, _this, [modes[i]["id"]]);
        modeBut.x = curX * (modeBut.width + (curX > 0 ? 4 : 0));
        modeBut.y = curY * (modeBut.height + (curY > 0 ? 4 : 0));
        _this.butContainer.add(modeBut);
        curX++;
        if (curX >= 2) {
          curX = 0;
          curY++;
        }
      }
      _this.add(_this.butContainer);
      _this.infoContainer = _this.game.add.group();
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.5);
      bg.drawRoundedRect(0, 0, 460, 530, TWP2.GameUtil.RECT_RADIUS);
      _this.infoContainer.add(bg);
      _this.nameText = _this.game.add.text(0, 0, "", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      _this.nameText.setTextBounds(0, 0, bg.width, 30);
      _this.nameText.y = 10;
      _this.infoContainer.add(_this.nameText);
      _this.descText = _this.game.add.text(0, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      _this.descText.setTextBounds(0, 0, bg.width, 30);
      _this.descText.y = _this.nameText.y + _this.nameText.height - 4;
      _this.infoContainer.add(_this.descText);
      var scoreContainer = _this.game.add.group();
      var bestScoreText = _this.game.add.text(0, 0, "Personal Best:", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      bestScoreText.alpha = 0.5;
      bestScoreText.setTextBounds(0, 0, 160, 30);
      scoreContainer.add(bestScoreText);
      _this.bestScoreText = _this.game.add.text(0, 0, "", { font: "32px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
      TWP2.GameUtil.SetTextShadow(_this.bestScoreText);
      _this.bestScoreText.setTextBounds(0, 0, 160, 30);
      _this.bestScoreText.y = bestScoreText.y + bestScoreText.height;
      scoreContainer.add(_this.bestScoreText);
      _this.starContainer = new TWP2.StarContainer();
      _this.starContainer.x = _this.bestScoreText.textBounds.halfWidth - _this.starContainer.width * 0.5;
      _this.starContainer.y = _this.bestScoreText.y + _this.bestScoreText.height + 4;
      scoreContainer.add(_this.starContainer);
      scoreContainer.x = _this.infoContainer.width * 0.5 - 160;
      scoreContainer.y = _this.descText.y + _this.descText.height + 10;
      _this.infoContainer.add(scoreContainer);
      var playButton = new TWP2.MenuButton(150, undefined, TWP2.ColourUtil.COLOUR_GREEN, 60, 20);
      playButton.setCallback(_this.prepareGame, _this);
      playButton.setLabelText("Start");
      playButton.x = _this.infoContainer.width * 0.5 + 10;
      playButton.y = scoreContainer.y + scoreContainer.height * 0.5 - playButton.height * 0.5;
      _this.infoContainer.add(playButton);
      _this.leaderboards = new TWP2.Leaderboards();
      _this.leaderboards.x = _this.infoContainer.width * 0.5 - _this.leaderboards.width * 0.5;
      _this.leaderboards.y = _this.infoContainer.height - _this.leaderboards.height - 6;
      _this.infoContainer.add(_this.leaderboards);
      var leaderboardsText = _this.game.add.text(0, 0, "Leaderboards", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      leaderboardsText.x = _this.infoContainer.width * 0.5 - leaderboardsText.width * 0.5;
      leaderboardsText.y = _this.leaderboards.y - leaderboardsText.height;
      _this.infoContainer.add(leaderboardsText);
      _this.infoContainer.x = _this.butContainer.x + _this.butContainer.width + 4;
      _this.add(_this.infoContainer);
      var lastGameModeId = TWP2.PlayerUtil.player["lastGameModeId"];
      if (lastGameModeId) {
        _this.setGameMode(lastGameModeId);
      } else {
        _this.setGameMode(TWP2.GameModeDatabase.GAME_SHOOTER);
      }
      return _this;
    }
    ModeContainer.prototype.prepareGame = function () {
      TWP2.GameUtil.game.prepareGame({ gameMode: this.getSelectedGameMode() });
      TWP2.PlayerUtil.player.stats["games"]++;
    };
    ModeContainer.prototype.getSelectedGameMode = function () {
      for (var i = 0; i < this.butContainer.length; i++) {
        var item = this.butContainer.getAt(i);
        if (item) {
          if (item.isSelected()) {
            return item.getButtonData()["id"];
          }
        }
      }
    };
    ModeContainer.prototype.setGameMode = function (_id) {
      var modeData = TWP2.GameModeDatabase.GetGameMode(_id);
      if (modeData) {
        for (var i = 0; i < this.butContainer.length; i++) {
          var item = this.butContainer.getAt(i);
          if (item) {
            item.setSelected(item.getButtonData()["id"] == _id);
          }
        }
      }
      this.nameText.setText(modeData["name"], true);
      this.descText.setText(modeData["desc"], true);
      var score = TWP2.PlayerUtil.player.bestScores[_id];
      this.bestScoreText.setText(TWP2.GameUtil.FormatNum(score), true);
      var stars = TWP2.GameModeDatabase.GetStarsForGameMode(_id, score);
      this.setStars(stars);
      TWP2.PlayerUtil.player["lastGameModeId"] = _id;
      TWP2.APIUtil.LoadLeaderboards(_id, this.leaderboards);
    };
    ModeContainer.prototype.setStars = function (_val) {
      this.starContainer.setStars(_val);
    };
    return ModeContainer;
  })(Phaser.Group);
  TWP2.ModeContainer = ModeContainer;
  var LoadoutContainer = /** @class */ (function (_super) {
    __extends(LoadoutContainer, _super);
    function LoadoutContainer() {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.currentLoadoutIndex = 0;
      _this.currentWeaponIndex = 0;
      _this.primary = new TWP2.WeaponButton();
      _this.primary.setPrimary(true);
      _this.primary.setCallback(_this.select, _this, [0]);
      _this.add(_this.primary);
      _this.secondary = new TWP2.WeaponButton();
      _this.secondary.setPrimary(false);
      _this.secondary.setCallback(_this.select, _this, [1]);
      _this.secondary.y = _this.primary.height + 4;
      _this.add(_this.secondary);
      _this.stats = new WeaponStats(_this.height);
      _this.stats.x = _this.width + 4;
      _this.add(_this.stats);
      return _this;
    }
    LoadoutContainer.prototype.setClearNewUnlocksButtonVisible = function (_bVal) {
      this.stats.setClearNewUnlocksButtonVisible(_bVal);
    };
    LoadoutContainer.prototype.setRemoveModsButtonVisible = function (_bVal) {
      this.stats.setRemoveModsButtonVisible(_bVal);
    };
    LoadoutContainer.prototype.select = function (_index) {
      TWP2.PlayerUtil.player["lastLoadoutWeapon"] = _index;
      this.setCurrentWeaponIndex(_index);
      //SoundManager.PlayUISound("wpn_loadout_select_" + MathUtil.Random(1, 3), 0.5);
      var buttons = [this.primary, this.secondary];
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setSelected(i == _index);
        if (i == _index) {
          this.stats.setCurrentData({
            loadoutIndex: this.currentLoadoutIndex,
            weaponIndex: this.currentWeaponIndex,
          });
          this.stats.setFromData(buttons[i].getButtonData(), TWP2.PlayerUtil.GetLoadoutItem(this.currentLoadoutIndex, this.currentWeaponIndex)["mods"]);
          this.stats.setWeaponNewIconVisible(TWP2.PlayerUtil.HasPendingItemsForWeaponCategories(this.currentWeaponIndex == 0 ? TWP2.WeaponDatabase.GetPrimaryWeaponTypes() : TWP2.WeaponDatabase.GetSecondaryWeaponTypes()));
          this.setRemoveModsButtonVisible(false);
          var loadoutData = TWP2.PlayerUtil.GetLoadoutItem(this.currentLoadoutIndex, this.currentWeaponIndex);
          var mods = loadoutData["mods"];
          for (var id in mods) {
            if (!TWP2.WeaponDatabase.IsDefaultMod(mods[id])) {
              this.setRemoveModsButtonVisible(true);
            }
          }
        }
      }
    };
    LoadoutContainer.prototype.setFromData = function (_data) {
      this.data = _data;
      if (this.data) {
        this.primary.setWeapon(TWP2.WeaponDatabase.GetWeapon(this.data["primary"]["id"]), this.data["primary"]["mods"]);
        this.secondary.setWeapon(TWP2.WeaponDatabase.GetWeapon(this.data["secondary"]["id"]), this.data["secondary"]["mods"]);
      }
    };
    LoadoutContainer.prototype.setCurrentLoadoutIndex = function (_val) {
      this.currentLoadoutIndex = _val;
    };
    LoadoutContainer.prototype.setCurrentWeaponIndex = function (_val) {
      this.currentWeaponIndex = _val;
    };
    LoadoutContainer.prototype.getCurrentLoadoutIndex = function () {
      return this.currentLoadoutIndex;
    };
    LoadoutContainer.prototype.getCurrentWeaponIndex = function () {
      return this.currentWeaponIndex;
    };
    return LoadoutContainer;
  })(Phaser.Group);
  TWP2.LoadoutContainer = LoadoutContainer;
  var WeaponStats = /** @class */ (function (_super) {
    __extends(WeaponStats, _super);
    function WeaponStats(_height) {
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      var gfx = _this.game.add.graphics();
      gfx.beginFill(0x000000, 0.5);
      gfx.drawRoundedRect(0, 0, 486, _height, TWP2.GameUtil.RECT_RADIUS);
      _this.add(gfx);
      var edgePadding = 4;
      _this.changeWeaponButton = new TWP2.MenuButton(130);
      _this.changeWeaponButton.setCallback(_this.openWeaponSelector, _this);
      _this.changeWeaponButton.setLabelText("Change");
      _this.changeWeaponButton.x = _this.width - _this.changeWeaponButton.width - edgePadding * 2;
      _this.changeWeaponButton.y = edgePadding * 2;
      _this.add(_this.changeWeaponButton);
      var container = _this.game.add.group();
      _this.add(container);
      _this.clearPendingButton = new TWP2.MenuButton(130, undefined, undefined, 30);
      _this.clearPendingButton.setCallback(_this.clearPendingUnlocks, _this);
      _this.clearPendingButton.setLabelText("Clear New Unlocks");
      _this.clearPendingButton.x = _this.changeWeaponButton.x;
      _this.clearPendingButton.y = _this.changeWeaponButton.y + _this.changeWeaponButton.height + 4;
      _this.add(_this.clearPendingButton);
      _this.add(container);
      _this.nameText = _this.game.add.text(edgePadding, edgePadding, "", { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
      TWP2.GameUtil.SetTextShadow(_this.nameText);
      container.add(_this.nameText);
      _this.descText = _this.game.add.text(edgePadding, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.descText.y = _this.nameText.height;
      container.add(_this.descText);
      _this.killsText = _this.game.add.text(edgePadding, 0, "", { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.killsText.y = _this.descText.y + _this.descText.height - 4;
      _this.killsText.alpha = 0.5;
      container.add(_this.killsText);
      var statsText = _this.game.add.text(edgePadding, 0, "Weapon Specs", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(statsText);
      statsText.y = _this.killsText.y + _this.killsText.height + 10;
      container.add(statsText);
      _this.statsContainer = new TWP2.StatsContainer();
      _this.statsContainer.x = edgePadding;
      container.add(_this.statsContainer);
      _this.statsContainer.y = statsText.y + statsText.height;
      var modsText = _this.game.add.text(edgePadding, 0, "Mods", { font: "18px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(modsText);
      modsText.y = _this.statsContainer.y + _this.statsContainer.height + 16;
      container.add(modsText);
      _this.removeModsButton = new TWP2.ImageButton("atlas_ui", "icon_trash");
      _this.removeModsButton.setCallback(_this.removeMods, _this);
      _this.removeModsButton.setBaseAlpha(0.2);
      _this.removeModsButton.x = modsText.x + modsText.width + 8;
      _this.removeModsButton.y = modsText.y + modsText.height * 0.5 - _this.removeModsButton.height * 0.5 - 2;
      container.add(_this.removeModsButton);
      _this.modsContainer = _this.game.add.group();
      _this.modsContainer.x = edgePadding;
      _this.modsContainer.y = modsText.y + modsText.height;
      container.add(_this.modsContainer);
      container.x = 4;
      container.y = 4;
      return _this;
    }
    WeaponStats.prototype.destroy = function () {
      this.data = null;
      this.nameText = null;
      this.descText = null;
      this.killsText = null;
      this.statsContainer = null;
      this.removeModsButton = null;
      this.modsContainer = null;
      this.changeWeaponButton = null;
      _super.prototype.destroy.call(this);
    };
    WeaponStats.prototype.setClearNewUnlocksButtonVisible = function (_bVal) {
      this.clearPendingButton.visible = _bVal;
    };
    WeaponStats.prototype.setRemoveModsButtonVisible = function (_bVal) {
      this.removeModsButton.visible = _bVal;
    };
    WeaponStats.prototype.removeMods = function () {
      var item = TWP2.PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
      item["mods"] = TWP2.WeaponDatabase.GetDefaultModsFor(item["id"]);
      TWP2.GameUtil.game.getMainMenu().getPlayMenu().refreshLoadout();
      TWP2.GameUtil.game.savePlayerData();
      TWP2.SoundManager.PlayUISound("wpn_loadout_select_" + TWP2.MathUtil.Random(1, 3), 0.5);
    };
    WeaponStats.prototype.setWeaponNewIconVisible = function (_bVal) {
      if (_bVal) {
        var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
        newIcon.tint = TWP2.ColourUtil.COLOUR_GREEN;
        this.changeWeaponButton.setIcon(newIcon, "right_top");
      } else {
        this.changeWeaponButton.setIcon(null);
      }
    };
    WeaponStats.prototype.clearPendingUnlocks = function () {
      TWP2.SoundManager.PlayUISound("ui_unlock_item", 0.5);
      TWP2.PlayerUtil.ClearPendingItems();
      TWP2.GameUtil.game.getMainMenu().getPlayMenu().refreshNewIcons();
      TWP2.GameUtil.game.getMainMenu().getPlayMenu().refreshLoadout();
    };
    WeaponStats.prototype.openWeaponSelector = function () {
      var loadout = TWP2.PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
      var data = {
        currentWeapon: TWP2.WeaponDatabase.GetWeapon(loadout["id"]),
        classIndex: this.data["loadoutIndex"],
        category: this.data["weaponIndex"] == 0 ? "primary" : "secondary",
      };
      var menu = new TWP2.WeaponSelectMenu(data);
    };
    WeaponStats.prototype.openModSelector = function (_modType) {
      var item = TWP2.PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
      var data = {
        loadoutIndex: this.data["loadoutIndex"],
        weaponIndex: this.data["weaponIndex"],
        modType: _modType,
      };
      var menu = new TWP2.ModSelectMenu(data);
    };
    WeaponStats.prototype.setCurrentData = function (_data) {
      this.data = _data;
    };
    WeaponStats.prototype.setFromData = function (_data, _mods) {
      if (_data) {
        this.nameText.setText(_data["name"], true);
        this.descText.setText(_data["desc"], true);
        var weaponStats = TWP2.PlayerUtil.player.weapons[_data["id"]];
        this.killsText.setText(weaponStats["kills"] + " kills â€¢ " + weaponStats["headshots"] + " headshots", true);
        this.statsContainer.setWeapon(_data, _mods);
        this.loadMods(_data);
      }
    };
    WeaponStats.prototype.loadMods = function (_weaponData) {
      this.modsContainer.removeAll(true);
      var arr = TWP2.WeaponDatabase.GetAvailableModsFor(_weaponData["id"]);
      var curX = 0;
      var curY = 0;
      var padding = 4;
      var loadout = TWP2.PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
      var loadoutMods = loadout["mods"];
      for (var i = 0; i < arr.length; i++) {
        var but = new TWP2.ModSelectButton();
        but.setCallback(this.openModSelector, this, [arr[i]]);
        but.setMod(TWP2.WeaponDatabase.GetMod(loadoutMods[arr[i]]));
        but.setLabelText(TWP2.WeaponDatabase.GetModString(arr[i]));
        but.setNewIconVisible(TWP2.PlayerUtil.HasPendingModType(loadout["id"], arr[i]));
        but.x = curX * (but.width + padding);
        but.y = curY * (but.height + padding);
        this.modsContainer.add(but);
        curX++;
      }
    };
    return WeaponStats;
  })(Phaser.Group);
  TWP2.WeaponStats = WeaponStats;
  var WeaponStat = /** @class */ (function (_super) {
    __extends(WeaponStat, _super);
    function WeaponStat(_labelText, _barWidth) {
      if (_barWidth === void 0) {
        _barWidth = 470;
      }
      var _this = _super.call(this, TWP2.GameUtil.game) || this;
      _this.value = 0;
      _this.modifierValue = 0;
      _this.bInverted = false;
      _this.labelText = _this.game.add.text(0, 0, _labelText, { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      _this.add(_this.labelText);
      var blocks = 5;
      _this.bar = new TWP2.UIBar({
        w: _barWidth,
        h: 4,
        barColour: 0xffffff,
        value: 0,
        blocks: blocks,
        bHideBarEdge: true,
        tweenFunc: Phaser.Easing.Exponential.Out,
      });
      _this.bar.y = _this.labelText.height - 2;
      _this.add(_this.bar);
      _this.redBar = new TWP2.UIBar({
        w: _barWidth,
        h: 4,
        value: 0,
        blocks: blocks,
        barColour: TWP2.ColourUtil.COLOUR_RED,
        bgAlpha: 0,
        tweenFunc: Phaser.Easing.Exponential.Out,
      });
      _this.redBar.y = _this.bar.y;
      _this.addAt(_this.redBar, 0);
      _this.greenBar = new TWP2.UIBar({
        w: _barWidth,
        h: 4,
        value: 0,
        blocks: blocks,
        barColour: TWP2.ColourUtil.COLOUR_GREEN,
        bgAlpha: 0,
        tweenFunc: Phaser.Easing.Exponential.Out,
      });
      _this.greenBar.y = _this.bar.y;
      _this.addAt(_this.greenBar, 0);
      return _this;
    }
    WeaponStat.prototype.destroy = function () {
      this.labelText = null;
      this.bar = null;
      _super.prototype.destroy.call(this);
    };
    WeaponStat.prototype.setInverted = function (_bVal) {
      this.bInverted = _bVal;
    };
    WeaponStat.prototype.setLabelText = function (_val) {
      this.labelText.setText(_val, true);
    };
    WeaponStat.prototype.setValue = function (_val) {
      this.value = _val;
      this.bar.setValue(_val);
      this.greenBar.setValue(_val);
      this.redBar.setValue(_val);
    };
    WeaponStat.prototype.setModifierValue = function (_val) {
      this.modifierValue = _val;
      this.redBar.visible = false;
      this.greenBar.visible = false;
      if (_val > this.value) {
        if (this.bInverted) {
          this.redBar.visible = true;
          this.redBar.setValue(_val);
        } else {
          this.greenBar.visible = true;
          this.greenBar.setValue(_val);
        }
      } else if (_val < this.value) {
        if (this.bInverted) {
          this.greenBar.visible = true;
          this.greenBar.setValue(this.value);
          this.bar.setValue(_val);
        } else {
          this.redBar.visible = true;
          this.redBar.setValue(this.value);
          this.bar.setValue(_val);
        }
      } else {
        //this.redBar.setValue(0);
        //this.greenBar.setValue(0);
      }
    };
    return WeaponStat;
  })(Phaser.Group);
  TWP2.WeaponStat = WeaponStat;
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var WeaponSelectMenu = /** @class */ (function (_super) {
    __extends(WeaponSelectMenu, _super);
    function WeaponSelectMenu(_data) {
      var _this = _super.call(this) || this;
      var bg = _this.game.add.graphics();
      bg.beginFill(0x000000, 0.2);
      bg.drawRect(0, 0, _this.game.width, _this.game.height);
      _this.add(bg);
      var backButton = new TWP2.BasicButton("icon_back");
      backButton.setCallback(_this.close, _this);
      backButton.x = 10;
      backButton.y = 10;
      _this.add(backButton);
      /*
          var helpButton = new ImageButton("atlas_ui", "icon_help");
          helpButton.x = this.width - helpButton.width - 10;
          helpButton.y = (backButton.y + (backButton.height * 0.5)) - (helpButton.height * 0.5);
          helpButton.setCallback(GameUtil.game.createWindow, GameUtil.game, [{
              type: Window.TYPE_MESSAGE,
              titleText: "Select Weapon",
              messageText: "Select a weapon for your loadout.\n\nNew weapons are unlocked as you rank up.",
              bShowOkayButton: true
          }]);
          this.add(helpButton);
          */
      var titleText = _this.game.add.text(0, 0, "Select Weapon", { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
      TWP2.GameUtil.SetTextShadow(titleText);
      titleText.x = _this.width * 0.5 - titleText.width * 0.5;
      titleText.y = backButton.y + backButton.height * 0.5 - titleText.height * 0.5;
      _this.add(titleText);
      var itemSelector = new TWP2.ItemSelector(true);
      itemSelector.x = 10;
      itemSelector.y = backButton.y + backButton.height + 10;
      itemSelector.setOnCloseCallback(_this.close, _this);
      var types;
      if (_data["category"] == "primary") {
        types = [
          {
            id: TWP2.WeaponDatabase.TYPE_SMG,
            label: "SMGs",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_RIFLE,
            label: "Assault Rifles",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_SNIPER,
            label: "High-Powered Rifles",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_SHOTGUN,
            label: "Shotguns",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_LMG,
            label: "LMGs",
          },
        ];
      } else if (_data["category"] == "secondary") {
        types = [
          {
            id: TWP2.WeaponDatabase.TYPE_PISTOL,
            label: "Pistols",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_MACHINE_PISTOL,
            label: "Machine Pistols",
          },
          {
            id: TWP2.WeaponDatabase.TYPE_LAUNCHER,
            label: "Launchers",
          },
        ];
      } else {
        types = [];
      }
      itemSelector.setPrevMenuId(_data["prevMenuId"]);
      itemSelector.setCurrentClassIndex(_data["classIndex"]);
      itemSelector.setCurrentTypeSlot(_data["category"]);
      if (_data["currentWeapon"]) {
        var currentWeapon = TWP2.WeaponDatabase.GetWeapon(_data["currentWeapon"]["id"]);
        itemSelector.setCurrentItemId(currentWeapon["id"]);
        itemSelector.setWeaponTypes(types, currentWeapon["type"]);
      } else if (_data["mod"] != undefined) {
      }
      _this.add(itemSelector);
      return _this;
    }
    WeaponSelectMenu.prototype.close = function () {
      var mainMenu = TWP2.GameUtil.game.getMainMenu();
      if (mainMenu) {
        var playMenu = mainMenu.getPlayMenu();
        if (playMenu) {
          playMenu.refreshLoadout();
        }
      }
      _super.prototype.close.call(this);
    };
    return WeaponSelectMenu;
  })(TWP2.ElementBase);
  TWP2.WeaponSelectMenu = WeaponSelectMenu;
  /*
  export class WeaponSelectMenu extends ElementBase
  {

      private data: any;
      private catContainer: Phaser.Group;
      private catButtons: MenuButton[];
      private listContainer: Phaser.Group;
      private currentWeapon: Phaser.Image;
      private statsContainer: StatsContainer;
      private desiredWeaponId: string;
      private weaponText: Phaser.Text;
      private descText: Phaser.Text;
      private equipButton: MenuButton;
      private lockIcon: Phaser.Image;
      private weaponTween: Phaser.Tween;
      private lockedText: Phaser.Text;
      private frame: Phaser.Graphics;

      constructor(_data: any)
      {
          super();

          this.data = _data;

          var bg = this.game.add.graphics();
          bg.beginFill(0x000000, 0.35);
          bg.drawRect(0, 0, this.game.width, this.game.height);
          this.add(bg);

          var closeButton = new ImageButton("atlas_ui", "icon_close");
          closeButton.x = this.game.width - closeButton.width - 10;
          closeButton.y = 10;
          closeButton.setCallback(this.close, this);
          this.add(closeButton);

          var midX = (this.width * 0.5) + 150;

          this.weaponText = this.game.add.text(0, 0, "", { font: "24px " + FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
          this.weaponText.setTextBounds(0, 0, 300, 20);
          this.weaponText.x = this.width * 0.5;
          this.weaponText.y = 100;
          this.add(this.weaponText);

          this.descText = this.game.add.text(0, 0, "", { font: "14px " + FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
          this.descText.setTextBounds(0, 0, 300, 20);
          this.descText.x = this.weaponText.x;
          this.descText.y = this.weaponText.y + this.weaponText.height - 4;
          this.add(this.descText);

          this.equipButton = new MenuButton(undefined);
          this.equipButton.setLabelText("Select");
          this.equipButton.x = (this.weaponText.x + this.weaponText.textBounds.halfWidth) - (this.equipButton.width * 0.5);
          this.equipButton.y = this.descText.y + this.descText.height + 10;
          this.add(this.equipButton);

          this.lockedText = this.game.add.text(0, 0, "", { font: "18px " + FontUtil.FONT, fill: ColourUtil.COLOUR_RED_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
          this.lockedText.setTextBounds(0, 0, 200, 20);
          this.lockedText.x = (this.equipButton.x + (this.equipButton.width * 0.5)) - (this.lockedText.textBounds.width * 0.5);
          this.lockedText.y = (this.equipButton.y + (this.equipButton.height * 0.5)) - (this.lockedText.height * 0.5) + 2;
          this.add(this.lockedText);

          this.frame = this.game.add.graphics();
          this.frame.beginFill(0xFFFFFF, 0);
          this.frame.drawRect(0, 0, 600, 200);
          this.frame.x = midX - (this.frame.width * 0.5);
          this.frame.y = (this.height * 0.45) - (this.frame.height * 0.5);
          this.add(this.frame);

          this.currentWeapon = this.game.add.image(0, 0, "atlas_weapons", WeaponDatabase.WEAPON_FIVESEVEN);
          this.currentWeapon.anchor.set(0.5, 0.5);
          this.currentWeapon.x = this.weaponText.x + this.weaponText.textBounds.halfWidth;
          this.currentWeapon.y = this.frame.y + (this.frame.height * 0.5);
          this.add(this.currentWeapon);

          this.lockIcon = this.game.add.image(0, 0, "atlas_ui", "icon_lock_large");
          this.lockIcon.anchor.set(0.5, 0.5);
          this.lockIcon.alpha = 0.8;
          this.lockIcon.x = this.currentWeapon.x;
          this.lockIcon.y = this.currentWeapon.y;
          this.add(this.lockIcon);

          this.statsContainer = new StatsContainer();
          this.statsContainer.x = this.currentWeapon.x - (this.statsContainer.width * 0.5);
          this.statsContainer.y = this.game.height - this.statsContainer.height - 30;
          this.add(this.statsContainer);

          var categories: string[];
          if (this.data["weaponIndex"] == 0)
          {
              categories = [
                  WeaponDatabase.TYPE_SMG,
                  WeaponDatabase.TYPE_RIFLE,
                  WeaponDatabase.TYPE_SHOTGUN,
                  WeaponDatabase.TYPE_SNIPER,
                  WeaponDatabase.TYPE_LMG,
              ];
          }
          else
          {
              categories = [
                  WeaponDatabase.TYPE_PISTOL,
                  WeaponDatabase.TYPE_MACHINE_PISTOL,
                  WeaponDatabase.TYPE_LAUNCHER
              ];
          }
          this.setCategories(categories);
      }

      destroy()
      {
          this.data = null;
          super.destroy();
      }

      public setCategories(_categories: string[]): void
      {
          if (this.catContainer)
          {
              this.catContainer.removeAll(true);
          }
          else
          {
              this.catContainer = this.game.add.group();
              this.catContainer.x = 4;
              this.catContainer.y = 4;
              this.add(this.catContainer);
          }
          if (!this.listContainer)
          {
              this.listContainer = this.game.add.group();
              this.add(this.listContainer);
          }
          this.catButtons = [];
          var desiredWidth = (this.width - 8 - (4 * (_categories.length - 1))) / _categories.length;
          for (var i = 0; i < _categories.length; i++)
          {
              var but = new MenuButton(desiredWidth);
              but.setLabelText(WeaponDatabase.GetTypeString(_categories[i]) + "s");
              but.setButtonData(_categories[i]);
              but.setCallback(this.selectCategory, this, [_categories[i]]);
              but.x = this.catContainer.width + (i > 0 ? 4 : 0);
              this.catContainer.add(but);
              this.catButtons.push(but);
              //but.setNewIconVisible(PlayerUtil.HasPendingItemsForWeaponCategories([_categories[i]]));
          }
          this.listContainer.y = this.catContainer.y + this.catContainer.height + 10;

          var loadoutItem = PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
          var weapon = WeaponDatabase.GetWeapon(loadoutItem["id"]);

          this.selectCategory(weapon["type"], loadoutItem["id"]);
      }

      public selectCategory(_id: string, _weaponId: string = null): void
      {
          for (var i = 0; i < this.catButtons.length; i++)
          {
              this.catButtons[i].setSelected(_id == this.catButtons[i].getButtonData());
          }
          this.listContainer.removeAll(true);
          var weapons = WeaponDatabase.GetAllByType(_id);
          var loadoutItem = PlayerUtil.GetLoadoutItem(this.data["loadoutIndex"], this.data["weaponIndex"]);
          for (var i = 0; i < weapons.length; i++)
          {
              var curWeapon = weapons[i];
              var but = new WeaponListButton();
              but.setCallback(this.selectWeapon, this, [curWeapon]);
              but.setButtonData(curWeapon["id"]);
              but.setWeapon(curWeapon);
              but.setCurrent(loadoutItem["id"] == curWeapon["id"]);
              but.setNewIconVisible(PlayerUtil.IsPendingItem(curWeapon["id"]));
              but.y = this.listContainer.height + (i > 0 ? 4 : 0);
              this.listContainer.add(but);
          }

          var selectedWeapon = weapons[0];
          if (_weaponId)
          {
              selectedWeapon = WeaponDatabase.GetWeapon(_weaponId);
          }

          this.selectWeapon(selectedWeapon);
      }

      public updateNewCategoryItems(): void
      {
          for (var i = 0; i < this.catButtons.length; i++)
          {
              var but = this.catButtons[i];
              //but.setNewIconVisible(PlayerUtil.HasPendingItemsForWeaponCategories([but.getButtonData()]));
          }
      }

      public selectWeapon(_data: any): void
      {
          var weapon = _data;
          this.data["currentWeapon"] = weapon;
          if (weapon)
          {
              PlayerUtil.ClearPendingItemById(weapon["id"]);
              this.weaponText.setText(weapon["name"], true);
              this.descText.setText(weapon["desc"], true);
              var bOwned: boolean = PlayerUtil.HasInventoryWeapon(weapon["id"]);
              this.lockIcon.visible = !bOwned;
              this.equipButton.visible = true;
              this.lockedText.visible = false;
              if (bOwned)
              {
                  this.equipButton.setDefaultLabelStyle();
                  this.equipButton.setLabelText("Equip");
                  this.equipButton.setIcon(null);
                  this.equipButton.setCallback(this.equipCurrentWeapon, this);
              }
              else
              {
                  var bLocked: boolean = weapon["unlockLevel"] > PlayerUtil.player["level"];
                  if (bLocked)
                  {
                      this.equipButton.visible = false;
                      this.lockedText.visible = true;
                      this.lockedText.setText("Reach level " + weapon["unlockLevel"] + " to unlock", true);
                  }
                  else
                  {
                      this.equipButton.setLabelText("Purchase: $" + GameUtil.FormatNum(weapon["cost"]));
                      this.equipButton.setCallback(GameUtil.game.createWindow, GameUtil.game, [{
                          titleText: "Purchase: " + weapon["name"],
                          messageText: "Are you sure you want to purchase this weapon?",
                          image: ["atlas_weapons_icons", weapon["id"]],
                          type: Window.TYPE_PURCHASE,
                          bShowEquipButton: true,
                          cost: weapon["cost"],
                          buyCallback: this.onBuyWeapon,
                          buyCallbackContext: this,
                          buyCallbackParams: [false],
                          equipCallbackParams: [true]
                      }]);
                  }
              }
              this.desiredWeaponId = weapon["id"];
              if (this.weaponTween)
              {
                  this.weaponTween.stop();
              }
              this.weaponTween = this.game.add.tween(this.currentWeapon).to({ alpha: 0, y: (this.frame.y + (this.frame.height * 0.45)) + 50 }, 100, Phaser.Easing.Exponential.Out, true);
              this.weaponTween.onComplete.addOnce(this.onTweenComplete, this);
              this.statsContainer.setWeapon(weapon, {});
          }
          for (var i = 0; i < this.listContainer.length; i++)
          {
              var child = this.listContainer.getAt(i) as WeaponListButton;
              if (child)
              {
                  child.setSelected(_data["id"] == child.getButtonData());
              }
          }
          SoundManager.PlayUISound("wpn_deploy_firearm_" + MathUtil.Random(1, 3), 0.1);
          this.updateNewCategoryItems();
      }

      public onBuyWeapon(_bEquip: boolean): void
      {
          PlayerUtil.AddWeaponToInventory(this.data["currentWeapon"]["id"]);
          this.selectWeapon(this.data["currentWeapon"]);
          for (var i = 0; i < this.listContainer.length; i++)
          {
              var child = this.listContainer.getAt(i) as WeaponListButton;
              if (child.getButtonData() == this.data["currentWeapon"]["id"])
              {
                  //child.setOwned();
                  break;
              }
          }
          if (_bEquip)
          {
              this.equipCurrentWeapon();
          }
      }

      private onTweenComplete(): void
      {
          this.currentWeapon.frameName = this.desiredWeaponId;
          if (this.weaponTween)
          {
              this.weaponTween.stop();
          }
          this.weaponTween = this.game.add.tween(this.currentWeapon).to({ alpha: this.lockIcon.visible ? 0.4 : 1, y: (this.frame.y + (this.frame.height * 0.5)) }, 200, Phaser.Easing.Exponential.Out, true);
      }

      public equipCurrentWeapon(): void
      {
          var loadout = PlayerUtil.player.loadouts[this.data["loadoutIndex"]];
          var id = "primary";
          if (this.data["weaponIndex"] == 1)
          {
              id = "secondary";
          }
          loadout[id]["id"] = this.data["currentWeapon"]["id"];
          loadout[id]["mods"] = WeaponDatabase.GetDefaultModsFor(loadout[id]["id"]);
          GameUtil.game.savePlayerData();
          this.close();
          SoundManager.PlayUISound("wpn_reload_end", 0.5);
      }

      public close(): void
      {
          super.close();
          GameUtil.game.getMainMenu().getPlayMenu().refreshNewIcons();
          GameUtil.game.getMainMenu().getPlayMenu().refreshLoadout();
      }

  }

  */
})(TWP2 || (TWP2 = {}));
var TWP2;
(function (TWP2) {
  var Window = /** @class */ (function (_super) {
    __extends(Window, _super);
    function Window() {
      var _this = _super.call(this) || this;
      _this.closeTweenTime = 40;
      return _this;
    }
    Window.prototype.destroy = function () {
      this.props = null;
      this.content = null;
      this.windowContainer = null;
      this.data = null;
      this.bg = null;
      this.overlay = null;
      _super.prototype.destroy.call(this);
    };
    Window.prototype.setFromData = function (_data) {
      this.data = _data;
      this.windowContainer = this.game.add.group();
      this.add(this.windowContainer);
      this.content = this.game.add.group();
      this.windowContainer.add(this.content);
      if (_data) {
        if (_data["onCloseCallback"]) {
          this.onCloseCallback = _data["onCloseCallback"];
        }
        if (_data["onCloseCallbackContext"]) {
          this.onCloseCallbackContext = _data["onCloseCallbackContext"];
        }
        if (_data["onCloseCallbackParameters"]) {
          this.onCloseCallbackParameters = _data["onCloseCallbackParameters"];
        }
        if (_data["soundId"]) {
          TWP2.SoundManager.PlayUISound(_data["soundId"]);
        }
        if (_data["titleText"]) {
          var useHeight = 40;
          var titleText = this.game.add.text(0, 0, _data["titleText"], { font: "24px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
          TWP2.GameUtil.SetTextShadow(titleText);
          titleText.setTextBounds(0, 3, Window.WINDOW_WIDTH, useHeight);
          this.windowContainer.add(titleText);
          var gfx = this.game.add.graphics();
          gfx.beginFill(0xffffff, 0.06);
          gfx.drawRect(0, 0, Window.WINDOW_WIDTH, useHeight);
          var img = this.game.add.image(0, 0, gfx.generateTexture());
          this.windowContainer.add(img);
          gfx.destroy();
        }
        if (_data["icon"]) {
          if (_data["icon"] instanceof Phaser.Image) {
            var useIcon = _data["icon"];
            useIcon.x = Window.MAX_CONTENT_WIDTH * 0.5 - useIcon.width * 0.5;
            this.content.add(useIcon);
            console.warn("Using Phaser.Image as 'icon'! " + _data["titleText"]);
          } else if (_data["icon"] instanceof Array) {
            var icon = this.game.add.image(0, 0, _data["icon"][0], _data["icon"][1]);
            icon.x = Window.MAX_CONTENT_WIDTH * 0.5 - icon.width * 0.5;
            this.content.add(icon);
          } else {
            var icon = this.game.add.image(0, 0, "atlas_ui", _data["icon"]);
            icon.x = Window.MAX_CONTENT_WIDTH * 0.5 - icon.width * 0.5;
            this.content.add(icon);
            if (_data["iconTint"]) {
              icon.tint = _data["iconTint"];
            }
          }
        }
        if (_data["messageText"]) {
          var messageText = this.game.add.text(0, 0, _data["messageText"], { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF", align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
          messageText.setTextBounds(0, 0, Window.MAX_CONTENT_WIDTH, messageText.height);
          messageText.y = this.content.height + (this.content.height > 0 ? 20 : 0);
          this.content.add(messageText);
          if (_data["highlights"]) {
            var message = _data["messageText"];
            var highlights = _data["highlights"];
            for (var i = 0; i < highlights.length; i++) {
              var cur = highlights[i];
              var index = _data["messageText"].indexOf(cur);
              if (index >= 0) {
                messageText.addColor(TWP2.ColourUtil.COLOUR_XP_STRING, index);
                messageText.addColor("#FFFFFF", index + cur.length);
              }
            }
          }
        }
        var type = _data["type"];
        if (type == Window.TYPE_YES_NO) {
          var buttons = this.game.add.group();
          var noButton = new TWP2.MenuButton(undefined, "center");
          noButton.setLabelText("No");
          noButton.setCallback(this.close, this);
          buttons.add(noButton);
          var yesButton = new TWP2.MenuButton(undefined, "center");
          yesButton.setLabelText("Yes");
          yesButton.setCallback(this.closeAndCallback, this, [_data["yesCallback"], _data["yesCallbackContext"], _data["yesCallbackParams"]]);
          yesButton.x = noButton.x + noButton.width + 4;
          buttons.add(yesButton);
          buttons.x = Window.MAX_CONTENT_WIDTH * 0.5 - buttons.width * 0.5;
          buttons.y = this.content.height + 20;
          this.content.add(buttons);
        } else if (type == Window.TYPE_DOWNLOAD) {
          var downloadButton = new TWP2.MenuButton(undefined, undefined, TWP2.ColourUtil.COLOUR_GREEN, 50, 20);
          downloadButton.setCallback(TWP2.GameUtil.OpenTWP2Download, TWP2.GameUtil);
          downloadButton.setLabelText("Download");
          downloadButton.x = Window.MAX_CONTENT_WIDTH * 0.5 - downloadButton.width * 0.5;
          downloadButton.y = this.content.height + 20;
          this.content.add(downloadButton);
        } else if (type == Window.TYPE_AD) {
          TWP2.PlayerUtil.player.adDate = new Date();
          var spinner = TWP2.GameUtil.CreateSpinner();
          spinner.x = Window.MAX_CONTENT_WIDTH * 0.5;
          spinner.y = this.content.height + 40;
          this.content.add(spinner);
          var adButton = new TWP2.MenuButton(180, "left", TWP2.ColourUtil.COLOUR_GREEN, 50, 24);
          adButton.setCallback(this.closeAndGiveMoney, this);
          adButton.setEnabled(false);
          adButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_buy"));
          adButton.setLabelText("Get $100");
          adButton.x = Window.MAX_CONTENT_WIDTH * 0.5 - adButton.width * 0.5;
          adButton.y = this.content.height + 20;
          this.content.add(adButton);
          TWP2.AdUtil.ShowAnchorAd();
          var timer = this.game.time.create();
          timer.add(500, TWP2.AdUtil.ShowAd, TWP2.AdUtil);
          timer.start();
          var timer = this.game.time.create();
          timer.add(TWP2.GameUtil.IsDebugging() ? 2000 : 8000, this.onShowAd, this, spinner, adButton);
          timer.start();
        } else if (type == Window.TYPE_WELCOME) {
          var wrapWidth = Window.MAX_CONTENT_WIDTH * 0.8;
          var playText = this.game.add.text(0, 0, "Play", { font: "20px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
          playText.x = Window.MAX_CONTENT_WIDTH * 0.5 - playText.width * 0.5;
          playText.y = this.content.height + 20;
          this.content.add(playText);
          var playDesc = this.game.add.text(0, 0, "Select a game mode and play the objective. You will be awarded a star rank based on your score. Try to earn all " + TWP2.GameModeDatabase.RANKED_STARS + " stars for every game mode!", {
            font: "14px " + TWP2.FontUtil.FONT,
            fill: "#FFFFFF",
            align: "center",
            wordWrap: true,
            wordWrapWidth: wrapWidth,
          });
          playDesc.x = Window.MAX_CONTENT_WIDTH * 0.5 - playDesc.width * 0.5;
          playDesc.y = this.content.height;
          this.content.add(playDesc);
          var loadoutsText = this.game.add.text(0, 0, "Loadouts", { font: "20px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
          loadoutsText.x = Window.MAX_CONTENT_WIDTH * 0.5 - loadoutsText.width * 0.5;
          loadoutsText.y = this.content.height + 20;
          this.content.add(loadoutsText);
          var loadoutsDesc = this.game.add.text(0, 0, "Customize your weapon loadouts by modifying your primary and secondary weapon. New weapons and attachments are unlocked as you rank up.", {
            font: "14px " + TWP2.FontUtil.FONT,
            fill: "#FFFFFF",
            align: "center",
            wordWrap: true,
            wordWrapWidth: wrapWidth,
          });
          loadoutsDesc.x = Window.MAX_CONTENT_WIDTH * 0.5 - loadoutsDesc.width * 0.5;
          loadoutsDesc.y = this.content.height;
          this.content.add(loadoutsDesc);
          var skillsText = this.game.add.text(0, 0, "Skills", { font: "20px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_XP_STRING });
          skillsText.x = Window.MAX_CONTENT_WIDTH * 0.5 - skillsText.width * 0.5;
          skillsText.y = this.content.height + 20;
          this.content.add(skillsText);
          var skillsDesc = this.game.add.text(0, 0, "Improve your performance by upgrading your skills! Skill points are awarded as you rank up.", {
            font: "14px " + TWP2.FontUtil.FONT,
            fill: "#FFFFFF",
            align: "center",
            wordWrap: true,
            wordWrapWidth: wrapWidth,
          });
          skillsDesc.x = Window.MAX_CONTENT_WIDTH * 0.5 - skillsDesc.width * 0.5;
          skillsDesc.y = this.content.height;
          this.content.add(skillsDesc);
        } else if (type == Window.TYPE_CONTROLS) {
          var controlsContainer = this.game.add.group();
          controlsContainer.name = "controlsContainer";
          var controls = [TWP2.PlayerUtil.CONTROL_RELOAD, TWP2.PlayerUtil.CONTROL_SWITCH_WEAPON, TWP2.PlayerUtil.CONTROL_BARREL, TWP2.PlayerUtil.CONTROL_ACTION];
          for (var i = 0; i < controls.length; i++) {
            var controlButton = new TWP2.ControlButton();
            controlButton.setCallback(this.onControlButtonClicked, this, [controls[i]]);
            controlButton.updateKey(controls[i]);
            controlButton.y = controlsContainer.height + (i > 0 ? 4 : 0);
            controlsContainer.add(controlButton);
          }
          controlsContainer.x = Window.MAX_CONTENT_WIDTH * 0.5 - controlsContainer.width * 0.5;
          controlsContainer.y = this.content.height + 20;
          this.content.add(controlsContainer);
        } else if (type == Window.TYPE_NEW_UNLOCKS) {
          TWP2.SoundManager.PlayUISound("ui_unlock");
          var unlocks = TWP2.GameUtil.CloneObject(TWP2.PlayerUtil.GetNewUnlocks());
          unlocks = unlocks.sort(TWP2.GameUtil.SortUnlocks);
          var weaponUnlocks = [];
          var modUnlocks = {};
          for (var i = 0; i < unlocks.length; i++) {
            var curUnlock = unlocks[i];
            if (curUnlock["type"] == "weapon") {
              weaponUnlocks.push(curUnlock);
            } else if (curUnlock["type"] == "mod") {
              if (!modUnlocks[curUnlock["data"]["weaponId"]]) {
                modUnlocks[curUnlock["data"]["weaponId"]] = [];
              }
              modUnlocks[curUnlock["data"]["weaponId"]].push(curUnlock["id"]);
            }
          }
          var container = this.game.add.group();
          var curX = 0;
          var curY = 0;
          var othersNum = 0;
          var maxCols = 3;
          var maxRows = 4;
          for (var i = 0; i < unlocks.length; i++) {
            var item = new TWP2.UnlockItem();
            item.setFromData(unlocks[i]);
            item.x = curX * (item.width + (curX > 0 ? 4 : 0));
            item.y = curY * (item.height + (curY > 0 ? 4 : 0));
            container.add(item);
            var delay = 300 + i * 80;
            item.alpha = 0;
            var tween = this.game.add.tween(item).to({ alpha: 1 }, 250, Phaser.Easing.Exponential.Out, true, delay);
            this.playSound("ui_unlock_item", delay);
            curX++;
            if (curX >= maxCols) {
              curY++;
              curX = 0;
            }
            if (curY >= maxRows) {
              othersNum = unlocks.length - (i + 1);
              break;
            }
          }
          container.x = Window.MAX_CONTENT_WIDTH * 0.5 - container.width * 0.5;
          container.y = this.content.height + 20;
          this.content.add(container);
          if (othersNum > 0) {
            var othersText = this.game.add.text(0, 0, "+" + othersNum + " other item" + TWP2.GameUtil.CheckPlural(othersNum) + "!", { font: "16px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_GREEN_STRING });
            othersText.x = Window.MAX_CONTENT_WIDTH * 0.5 - othersText.width * 0.5;
            othersText.y = this.content.height + 8;
            this.content.add(othersText);
          }
          var loadoutsButton = new TWP2.MenuButton();
          loadoutsButton.setCallback(this.viewLoadouts, this);
          loadoutsButton.setLabelText("View Loadouts");
          loadoutsButton.x = Window.MAX_CONTENT_WIDTH * 0.5 - loadoutsButton.width * 0.5;
          loadoutsButton.y = this.content.height + 20;
          this.content.add(loadoutsButton);
          TWP2.PlayerUtil.ClearNewUnlocks();
        } else if (type == Window.TYPE_PURCHASE) {
          var bCanAfford = _data["cost"] <= TWP2.PlayerUtil.player["money"];
          if (_data["image"]) {
            var image = this.game.add.image(0, 0, _data["image"][0], _data["image"][1]);
            image.x = Window.MAX_CONTENT_WIDTH * 0.5 - image.width * 0.5;
            image.y = this.content.height + 20;
            this.content.add(image);
          }
          var costText = this.game.add.text(0, 0, "$" + TWP2.GameUtil.FormatNum(_data["cost"]), { font: "24px " + TWP2.FontUtil.FONT, fill: TWP2.ColourUtil.COLOUR_MONEY_STRING });
          costText.x = Window.MAX_CONTENT_WIDTH * 0.5 - costText.width * 0.5;
          costText.y = this.content.height + 20;
          this.content.add(costText);
          var moneyText = this.game.add.text(0, 0, "Available Funds: $" + TWP2.GameUtil.FormatNum(TWP2.PlayerUtil.player["money"]), { font: "14px " + TWP2.FontUtil.FONT, fill: "#FFFFFF" });
          moneyText.alpha = 0.5;
          moneyText.x = Window.MAX_CONTENT_WIDTH * 0.5 - moneyText.width * 0.5;
          moneyText.y = this.content.height;
          this.content.add(moneyText);
          var buttons = this.game.add.group();
          var yesButton = new TWP2.MenuButton();
          yesButton.setLabelText(bCanAfford ? "Purchase" : "Not Enough Money!");
          yesButton.setEnabled(bCanAfford);
          if (!bCanAfford) {
            //yesButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_close"));
          }
          //yesButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_buy"));
          yesButton.setCallback(this.buyAndCallback, this, [_data["cost"], _data["buyCallback"], _data["buyCallbackContext"], _data["buyCallbackParams"]]);
          buttons.add(yesButton);
          if (bCanAfford && _data["bShowEquipButton"] == true) {
            var equipButton = new TWP2.MenuButton();
            equipButton.setLabelText("Purchase and Equip");
            equipButton.setEnabled(bCanAfford);
            //equipButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_buy"));
            equipButton.setCallback(this.buyAndCallback, this, [_data["cost"], _data["buyCallback"], _data["buyCallbackContext"], _data["equipCallbackParams"]]);
            equipButton.x = buttons.width + 4;
            buttons.add(equipButton);
          }
          buttons.x = Window.MAX_CONTENT_WIDTH * 0.5 - buttons.width * 0.5;
          buttons.y = this.content.height + 20;
          this.content.add(buttons);
        } else if (type == Window.TYPE_MODS) {
          var modsContainer = this.game.add.group();
          modsContainer.name = "modsContainer";
          var weapon = _data["weapon"];
          var weaponIcon = this.game.add.image(0, 0, "atlas_weapons_icons_small", weapon["id"]);
          weaponIcon.x = Window.MAX_CONTENT_WIDTH * 0.5 - weaponIcon.width * 0.5;
          weaponIcon.y = this.content.height + 10;
          this.content.add(weaponIcon);
          var arr = TWP2.WeaponDatabase.GetAvailableModsFor(weapon["id"]);
          var curX = 0;
          var curY = 0;
          var padding = 4;
          var loadoutMods = {
            base: weapon["baseMod"],
            optic: weapon["optic"],
            mag: weapon["magMod"],
            barrel: weapon["barrel"],
            muzzle: weapon["muzzleMod"],
          };
          for (var i = 0; i < arr.length; i++) {
            var but = new TWP2.ModSelectButton();
            but.name = arr[i];
            but.setCallback(this.openModSelector, this, [arr[i], weapon]);
            but.setMod(TWP2.WeaponDatabase.GetMod(loadoutMods[arr[i]]));
            but.setLabelText(TWP2.WeaponDatabase.GetModString(arr[i]));
            but.x = curX * (but.width + padding);
            but.y = curY * (but.height + padding);
            modsContainer.add(but);
            curX++;
          }
          modsContainer.x = Window.MAX_CONTENT_WIDTH * 0.5 - modsContainer.width * 0.5;
          modsContainer.y = this.content.height + 20;
          this.content.add(modsContainer);
        }
        if (_data["bShowSpinner"] == true) {
          var spinner = TWP2.GameUtil.CreateSpinner();
          spinner.x = Window.MAX_CONTENT_WIDTH * 0.5;
          spinner.y = this.content.height + spinner.height * 0.5 + 12;
          this.content.add(spinner);
        }
        if (_data["bShowOkayButton"] == true) {
          var okButton = new TWP2.MenuButton(undefined, "center");
          okButton.setCallback(this.close, this);
          okButton.setLabelText("OK");
          okButton.x = Window.MAX_CONTENT_WIDTH * 0.5 - okButton.width * 0.5;
          okButton.y = this.content.height + 20;
          this.content.add(okButton);
        }
        if (_data["bHideCloseButton"] != true) {
          var closeButton = new TWP2.ImageButton("atlas_ui", "icon_close");
          closeButton.setCallback(this.close, this);
          closeButton.x = Window.WINDOW_WIDTH - closeButton.width - 4;
          if (titleText) {
            closeButton.y = titleText.y + titleText.height * 0.5 - closeButton.height * 0.5 + 5;
          }
          this.windowContainer.add(closeButton);
          this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.addOnce(this.onEscKeyPressed, this);
        }
        var speechIcon = this.game.add.image(0, 0, "atlas_ui", "icon_speech");
        speechIcon.alpha = 0.1;
        speechIcon.x = 4;
        speechIcon.y = titleText.y + titleText.height * 0.5 - speechIcon.height * 0.5 + 6;
        this.windowContainer.add(speechIcon);
        if (_data["autoCloseTimer"]) {
          var timer = this.game.time.create();
          timer.add(_data["autoCloseTimer"], this.close, this);
          timer.start();
        }
        /*
              var windowIcon = this.game.add.image(0, 0, "atlas_ui", "icon_speech");
              windowIcon.alpha = 0.1;
              windowIcon.x = 4;
              windowIcon.y = (titleText.y + (titleText.height * 0.5)) - (windowIcon.height * 0.5) + 1;
              this.windowContainer.add(windowIcon);
              */
      }
      var gfx = this.game.add.graphics();
      gfx.beginFill(0x000000, 0.8);
      gfx.drawRoundedRect(0, 0, Window.WINDOW_WIDTH, this.content.height + Window.WINDOW_PADDING * 2 + titleText.height, TWP2.GameUtil.RECT_RADIUS);
      this.bg = this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.windowContainer.addAt(this.bg, 0);
      this.content.x = Window.WINDOW_PADDING;
      this.content.y = Window.WINDOW_PADDING + titleText.height;
      this.windowContainer.x = this.game.width * 0.5 - this.windowContainer.width * 0.5;
      this.windowContainer.y = this.game.height * 0.5 - this.windowContainer.height * 0.5;
      var gfx = this.game.add.graphics();
      gfx.beginFill(0xffffff, 0.25);
      gfx.drawRect(0, 0, this.game.width, this.game.height);
      this.overlay = this.game.add.image(0, 0, gfx.generateTexture());
      gfx.destroy();
      this.addAt(this.overlay, 0);
      var tween = this.game.add.tween(this.windowContainer).from({ y: this.windowContainer.y + 100 }, 150, Phaser.Easing.Back.Out, true);
    };
    Window.prototype.closeAndGiveMoney = function () {
      TWP2.PlayerUtil.AddMoney(100);
      TWP2.SoundManager.PlayUISound("ui_purchase");
      this.close();
    };
    Window.prototype.onShowAd = function (_spinner, _adButton) {
      var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
      checkmark.tint = TWP2.ColourUtil.COLOUR_GREEN;
      checkmark.anchor.set(0.5, 0.5);
      checkmark.x = _spinner.x;
      checkmark.y = _spinner.y;
      _spinner.parent.add(checkmark);
      var tween = this.game.add.tween(checkmark.scale).from({ x: 2, y: 2 }, 200, Phaser.Easing.Back.Out, true);
      _spinner.destroy();
      _adButton.setEnabled(true);
      TWP2.AdUtil.OnResumeGame();
    };
    Window.prototype.updateMods = function (_weaponData) {
      this.data["weapon"] = _weaponData;
      console.log(_weaponData);
      TWP2.GameUtil.game.createWindow(this.data);
      this.close();
    };
    Window.prototype.openModSelector = function (_modType, _weapon) {
      var item = TWP2.PlayerUtil.GetLoadoutItem(0, 0);
      var data = {
        bRange: true,
        weapon: _weapon,
        modType: _modType,
        window: this,
      };
      var menu = new TWP2.ModSelectMenu(data);
    };
    Window.prototype.onControlButtonClicked = function (_id) {
      TWP2.GameUtil.game.openSetKeyMenu(_id, this.updateControls, this);
    };
    Window.prototype.updateControls = function () {
      var controlsContainer = this.content.getByName("controlsContainer");
      if (controlsContainer) {
        for (var i = 0; i < controlsContainer.length; i++) {
          var but = controlsContainer.getAt(i);
          if (but) {
            but.refreshKey();
          }
        }
      }
    };
    Window.prototype.playSound = function (_id, _delay) {
      var timer = this.game.time.create();
      timer.add(_delay, TWP2.SoundManager.PlayUISound, TWP2.SoundManager, _id, 0.5);
      timer.start();
    };
    Window.prototype.viewLoadouts = function () {
      var playMenu = TWP2.GameUtil.game.getMainMenu().getPlayMenu();
      playMenu.setMenu(TWP2.PlayMenu.MENU_LOADOUTS);
      this.close();
    };
    Window.prototype.onEscKeyPressed = function () {
      if (!this.bDestroyed) {
        this.close();
      }
    };
    Window.prototype.show = function () {
      _super.prototype.show.call(this);
      TWP2.SoundManager.PlayUISound("ui_window_open");
    };
    Window.prototype.close = function () {
      _super.prototype.close.call(this);
      var tween = this.game.add.tween(this.windowContainer).to({ y: this.windowContainer.y + 50 }, this.closeTweenTime, Phaser.Easing.Back.Out, true);
      TWP2.SoundManager.PlayUISound("ui_window_close");
    };
    Window.prototype.closeAndCallback = function (_callback, _callbackContext, _callbackParams) {
      this.onCloseCallback = _callback;
      this.onCloseCallbackContext = _callbackContext;
      this.onCloseCallbackParameters = _callbackParams;
      this.close();
    };
    Window.prototype.buyAndCallback = function (_cost, _callback, _callbackContext, _callbackParams) {
      TWP2.PlayerUtil.Buy(_cost);
      this.onCloseCallback = _callback;
      this.onCloseCallbackContext = _callbackContext;
      this.onCloseCallbackParameters = _callbackParams;
      this.close();
    };
    Window.TYPE_MESSAGE = "TYPE_MESSAGE";
    Window.TYPE_YES_NO = "TYPE_YES_NO";
    Window.TYPE_PURCHASE = "TYPE_PURCHASE";
    Window.TYPE_NEW_UNLOCKS = "TYPE_NEW_UNLOCKS";
    Window.TYPE_RANKED = "TYPE_RANKED";
    Window.TYPE_DOWNLOAD = "TYPE_DOWNLOAD";
    Window.TYPE_WELCOME = "TYPE_WELCOME";
    Window.TYPE_CONTROLS = "TYPE_CONTROLS";
    Window.TYPE_MODS = "TYPE_MODS";
    Window.TYPE_AD = "TYPE_AD";
    Window.WINDOW_PADDING = 40;
    Window.WINDOW_WIDTH = 750;
    Window.MAX_CONTENT_WIDTH = Window.WINDOW_WIDTH - Window.WINDOW_PADDING * 2;
    return Window;
  })(TWP2.ElementBase);
  TWP2.Window = Window;
})(TWP2 || (TWP2 = {}));
//# sourceMappingURL=TWP2.js.map
