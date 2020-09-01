App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,

     init: function() {
          return App.initWeb3();
     },

     initWeb3: function() {
          // initialize web3
          if (typeof web3 !== "undefined") {
               App.web3Provider = web3.currentProvider;
          } else {
               App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
          }

          web3 = new Web3(App.web3Provider);
          console.log(web3);

          App.displayAccountInfo();

          return App.initContract();
     },

     displayAccountInfo: function() {
          web3.eth.getCoinbase(function(err, account) {
               if (err === null) {
                    App.account = account;
                    $("#account").text(account);
                    web3.eth.getBalance(account, function(err, balance) {
                         if (err === null) {
                              $("#accountBalance").text(web3.fromWei(balance, "ether") + "ETH")
                         }
                    })
               }
          });
     },

     initContract: function() {
          $.getJSON("ChainList.json", function(chainListArtifact) {
               App.contracts.ChainList = TruffleContract(chainListArtifact);
               App.contracts.ChainList.setProvider(App.web3Provider);
               App.listenToEvents();
               return App.reloadArticles();
          });
     },

     reloadArticles: function() {
          App.displayAccountInfo();

          $("#articlesRow").empty();

          App.contracts.ChainList.deployed().then(function(instance) {
               return instance.getArticle();
          }).then(function (article) {
               if(article[0] == 0x0) {
                    return;
               }

               var articleTemplate = $("#articleTemplate");
               articleTemplate.find(".panel-title").text(article[1]);
               articleTemplate.find(".article-description").text(article[2]);
               articleTemplate.find(".article-price").text(web3.fromWei(article[3], "ether"));

               var seller = article[0];
               if (seller == App.account) {
                    seller = "You";
               }
               articleTemplate.find(".article-seller").text(seller);

               $("#articlesRow").append(articleTemplate.html());
          }).catch(function(err) {
               console.error(err);
          });
     },

     sellArticle: function() {
          var _articleName = $("#article_name").val();
          var _articleDesc = $("#article_description").val();
          var _articlePrice = web3.toWei(parseFloat($("#article_price").val() || 0), "ether");

          if(_articleName.trim() == "" || _articlePrice == 0) {
               return false;
          }

          App.contracts.ChainList.deployed().then(function(instance) {
               return instance.sellArticle(_articleName, _articleDesc, _articlePrice, {
                    from: App.account,
                    gas: 500000
               });
          }).catch(function(err) {
               console.error(err);
          });
     },

     listenToEvents: function() {
          App.contracts.ChainList.deployed().then(function(instance) {
               instance.LogSellArticle({}, {}).watch(function(error, event) {
                    if(!error){
                         console.log("WTF");
                         $("#events").append("<li class='list-group-item'>" + event.args._name + " is now for sale</li>");
                    }else {
                         console.error(error);
                    }
                    App.reloadArticles();
               });
          });
     }
};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
