'use strict';
character.hearth={
	character:{
		hs_jaina:['female','wei',3,['huopu','bianxing','bingjia'],['fullskin']],
		hs_lrexxar:['male','qun',4,['shoulie','gongji'],['fullskin']],
		hs_wuther:['male','qun',4,['fengxian','jieming'],['fullskin']],
		hs_jgarrosh:['male','qun',4,['zhanhou','qiangxi'],['fullskin']],
		hs_malfurion:['male','wu',4,['jihuo'],['fullskin']],
		hs_guldan:['male','qun',3,['fenliu','hongxi'],['fullskin']],
		hs_anduin:['male','qun',3,['shengguang','shijie','anying'],['fullskin']],
		hs_sthrall:['male','wu',4,['tuteng','guozai'],['fullskin']],
		hs_waleera:['female','qun',3,['jianren','mengun','wlianji'],['fullskin']],

		hs_medivh:['male','wei',3,['jingxiang','moying','mdzhoufu'],['fullskin']],
		hs_alleria:['male','wu',3,['fengxing','qiaodong','liegong'],['fullskin']],
		hs_magni:['male','qun',4,['zhongjia','dunji'],['fullskin']],

		hs_neptulon:['male','wu',4,['liechao','qingliu'],['fullskin']],
		hs_wvelen:['male','qun',3,['shengyan','xianzhi'],['fullskin']],
		hs_antonidas:['male','wei',3,['yanshu','bingshuang'],['fullskin']],
		hs_alakir:['male','wei',3,['fengnu','shengdun'],['fullskin']],
		hs_zhouzhuo:['male','qun',3,['jubao','qice'],['fullskin']],
		hs_yngvar:['male','qun',3,['huanwu'],['fullskin']],
		hs_bchillmaw:['male','wei',6,['hanshuang','bingshi'],['fullskin']],
		hs_malorne:['male','wu',3,['enze','chongsheng'],['fullskin']],
		hs_malygos:['male','wei',4,['malymowang'],['fullskin']],
		hs_xuefashi:['male','wei',2,['liehun','xjumo'],['fullskin']],
		// hs_loatheb:['male','wei',2,[],['fullskin']],
		// hs_trueheart:['male','wei',2,[],['fullskin']],
		// hs_sainaliusi:['male','wei',2,[],['fullskin']],
		// hs_lrhonin:['male','wei',2,[],['fullskin']],
		// hs_bolvar:['male','wei',2,[],['fullskin']],
		// hs_fuding:['male','wei',2,[],['fullskin']],

		hs_ronghejuren:['male','shu',8,[],['fullskin']],
		hs_edwin:['male','qun',3,['lianzhan'],['fullskin']],
		hs_mijiaojisi:['female','qun',3,['kuixin'],['fullskin']],
		hs_huzhixiannv:['female','wu',3,['jingmeng','qingliu'],['fullskin']],
		// hs_tgolem:['male','qun',4,['guozai'],['fullskin']],
		hs_totemic:['male','wu',3,['s_tuteng'],['fullskin']],
		hs_xsylvanas:['female','qun',3,['busi','shixin','xmojian'],['fullskin']],
		hs_siwangzhiyi:['male','qun',12,['mieshi'],['fullskin']],
		hs_bilanyoulong:['male','wei',4,['lingzhou'],['fullskin']],
	},
	perfectPair:{
		hs_sthrall:['hs_totemic','hs_alakir','hs_neptulon','hs_yngvar','hs_tgolem'],
		hs_anduin:['hs_wvelen','hs_mijiaojisi'],
		hs_jaina:['hs_antonidas'],
		hs_malfurion:['hs_malorne'],
	},
	skill:{
		liehun:{
			trigger:{player:'phaseUseBegin'},
			forced:true,
			filter:function(event,player){
				return player.num('h',{type:'basic'})<player.num('h');
			},
			content:function(){
				var hs=player.get('h');
				for(var i=0;i<hs.length;i++){
					if(get.type(hs[i])=='basic'){
						hs.splice(i--,1);
					}
				}
				if(hs.length){
					var hs2=[];
					for(var i=0;i<hs.length;i++){
						hs2.push(game.createCard(hs[i].name,hs[i].suit,hs[i].number));
					}
					player.gain(hs2,'draw');
				}
			},
			ai:{
				threaten:1.5
			}
		},
		xjumo:{
			mod:{
				maxHandcard:function(player,num){
					return num+3;
				}
			},
		},
		malymowang:{
			trigger:{source:'damageBegin'},
			forced:true,
			filter:function(event){
				return event.card&&get.type(event.card)=='trick'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
			},
			content:function(){
				trigger.num++;
			},
			group:'malymowang2',
			ai:{
				threaten:1.8
			}
		},
		malymowang2:{
			trigger:{player:'phaseUseBegin'},
			forced:true,
			content:function(){
				'step 0'
				var list=[];
				for(var i in lib.card){
					if(!lib.translate[i+'_info']) continue;
					if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
					if(lib.card[i].type=='trick') list.push(['锦囊','',i]);
				}
				list=list.randomGets(3);
				var dialog=ui.create.dialog('选择一张锦囊牌加入你的手牌',[list,'vcard'],'hidden');
				player.chooseButton(dialog,true);
				'step 1'
				if(result.buttons){
					player.gain(game.createCard(result.buttons[0].link[2]),'gain2');
				}
			}
		},
		lingzhou:{
			trigger:{player:'useCard'},
			direct:true,
			filter:function(event){
				return get.type(event.card,'trick')=='trick';
			},
			content:function(){
				"step 0"
				var noneed=(trigger.card.name=='tao'&&trigger.targets[0]==player&&player.hp==player.maxHp-1);
				player.chooseTarget('是否发动【灵咒】？').ai=function(target){
					var num=ai.get.attitude(player,target);
					if(num>0){
						if(noneed&&player==target){
							num=0.5;
						}
						else if(target.hp==1){
							num+=3;
						}
						else if(target.hp==2){
							num+=1;
						}
					}
					return num;
				}
				"step 1"
				if(result.bool){
					player.logSkill('lingzhou',result.targets);
					var target=result.targets[0];
					if(target.hp<target.maxHp){
						target.chooseControl('draw_card','recover_hp',function(event,target){
							if(target.hp>=3&&target.num('h')<target.hp) return 'draw_card';
							return 'recover_hp';
						});
						event.target=target;
					}
					else{
						target.draw();
						event.finish();
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.control=='draw_card'){
					event.target.draw();
				}
				else{
					event.target.recover();
				}
			},
			ai:{
				expose:0.2,
				threaten:1.5
			}
		},
		mieshi:{
			trigger:{player:'phaseEnd'},
			forced:true,
			content:function(){
				'step 0'
				player.loseHp();
				'step 1'
				event.target=game.players.randomGet(player);
				player.line(event.target,'fire');
				game.delayx();
				'step 2'
				event.target.damage('fire');
			}
		},
		xmojian:{
			trigger:{player:'turnOverAfter'},
			direct:true,
			filter:function(event,player){
				return !player.skills.contains('xmojian2');
			},
			content:function(){
				"step 0"
				player.chooseTarget('是否发动【魔箭】？',function(card,player,target){
					return lib.filter.targetEnabled({name:'sha'},player,target);
				}).ai=function(target){
					return ai.get.effect(target,{name:'sha'},player);
				}
				"step 1"
				if(result.bool){
					player.logSkill('xmojian');
					player.useCard({name:'sha'},result.targets,false);
					player.addTempSkill('xmojian2','phaseAfter');
				}
			},
			ai:{
				expose:0.2,
			}
		},
		xmojian2:{},
		shixin:{
			trigger:{source:'damageEnd'},
			forced:true,
			filter:function(event,player){
				return event.player.isAlive()&&event.player!=player;
			},
			content:function(){
				'step 0'
				trigger.player.loseHp();
				'step 1'
				player.loseHp();
			}
		},
		enze:{
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return player.num('h')!=target.num('h');
			},
			content:function(){
				var num=player.num('h')-target.num('h');
				if(num>0){
					target.draw(num);
				}
				else if(num<0){
					target.chooseToDiscard(-num,true);
				}
			},
			ai:{
				threaten:1.8,
				order:function(name,player){
					return 10;
				},
				result:{
					target:function(player,target){
						return player.num('h')-target.num('h');
					}
				},
				expose:0.2
			}
		},
		chongsheng:{
			unique:true,
			enable:'chooseToUse',
			mark:true,
			init:function(player){
				player.storage.chongsheng=0;
				game.addVideo('storage',player,['chongsheng',player.storage.chongsheng]);
			},
			filter:function(event,player){
				if(event.type!='dying') return false;
				if(player!=_status.dying) return false;
				if(player.storage.chongsheng==2) return false;
			},
			content:function(){
				player.hp=Math.min(2-player.storage.chongsheng,player.maxHp);
				player.discard(player.get('hej'));
				player.draw(2-player.storage.chongsheng);
				player.storage.chongsheng++;
				if(player.storage.chongsheng==2){
					player.unmarkSkill('chongsheng');
				}
				if(player.classList.contains('linked')) player.link();
				if(player.classList.contains('turnedover')) player.turnOver();
				game.addVideo('storage',player,['chongsheng',player.storage.chongsheng]);
			},
			ai:{
				skillTagFilter:function(player){
					if(player.storage.chongsheng==2) return false;
					if(player.hp>0) return false;
				},
				save:true,
				result:{
					player:10
				},
				threaten:function(player,target){
					if(target.storage.chongsheng<2) return 0.6;
				}
			},
			intro:{
				content:function(storage){
					return '剩余'+get.cnNumber(2-storage)+'次';
				}
			}
		},
		guozai:{
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return player.num('h')<4;
			},
			init:function(player){
				player.storage.guozai2=0;
			},
			content:function(){
				var num=4-player.num('h');
				player.draw(num);
				player.addSkill('guozai2');
				player.storage.guozai2+=num;
				game.addVideo('storage',player,['guozai2',player.storage.guozai2]);
			},
			ai:{
				order:1,
				result:{
					player:1
				}
			}
		},
		guozai2:{
			mark:true,
			intro:{
				content:function(storage){
					return '需弃置'+get.cnNumber(storage)+'张牌';
				}
			},
			trigger:{player:'phaseUseEnd'},
			forced:true,
			content:function(){
				player.chooseToDiscard('he',true,player.storage.guozai2);
				player.storage.guozai2=0;
				player.removeSkill('guozai2');
			}
		},
		hanshuang:{
			trigger:{source:'damageEnd'},
			forced:true,
			filter:function(event,player){
				return event.card&&get.color(event.card)=='black'&&
				!event.player.isTurnedOver()&&event.player.isAlive();
			},
			content:function(){
				trigger.player.turnOver();
				player.loseHp();
			},
			ai:{
				threaten:1.5,
				effect:{
					player:function(card,player,target,current){
						if(get.color(card)=='black'&&get.tag(card,'damage')){
							return [1,0,1,-2];
						}
					}
				}
			}
		},
		bingshi:{
			global:'bingshi2'
		},
		bingshi2:{
			trigger:{global:'dieAfter'},
			forced:true,
			filter:function(event,player){
				return event.player.skills.contains('bingshi')&&event.player.isDead();
			},
			content:function(){
				trigger.player.line(player,'thunder');
				player.damage('nosource','thunder').animate=false;
				player.$damage(trigger.player);
				player.$thunder();
			}
		},
		huanwu:{
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return !target.storage.huanwu;
			},
			content:function(){
				target.gainMaxHp();
				target.recover();
				target.draw(2);
				target.storage.huanwu=true;
				target.mark('huanwu',{
					name:'唤雾',
					content:'已发动'
				});
				game.addVideo('mark',target,{
					name:'唤雾',
					content:'已发动',
					id:'huanwu'
				});
			},
			ai:{
				threaten:1.2,
				result:{
					target:function(player,target){
						return 1/target.hp;
					}
				},
				order:10,
				expose:0.3
			}
		},
		fengnu:{
			mod:{
				cardUsable:function(){
					return Infinity;
				},
				targetInRange:function(){
					return true;
				}
			},
			trigger:{player:'useCard'},
			filter:function(event,player){
				if(_status.currentPhase!=player) return false;
				return get.cardCount(event.card,player)>1;
			},
			forced:true,
			content:function(){
				player.draw();
			}
		},
		shengdun:{
			trigger:{player:'phaseBegin'},
			forced:true,
			filter:function(event,player){
				return !player.hujia;
			},
			content:function(){
				player.changeHujia();
				player.update();
			},
		},
		shengdun_old:{
			trigger:{player:'phaseBegin'},
			forced:true,
			silent:true,
			popup:false,
			priority:10,
			init2:function(player){
				player.markSkill('shengdun');
			},
			content:function(){
				if(player.storage.shengdun){
					player.markSkill('shengdun');
				}
				player.storage.shengdun=false;
			},
			intro:{
				content:'未发动'
			},
			group:'shengdun2'
		},
		shengdun_old2:{
			trigger:{player:'damageBegin'},
			forced:true,
			filter:function(event,player){
				return event.num>0&&!player.storage.shengdun;
			},
			content:function(){
				trigger.num--;
				player.storage.shengdun=true;
				player.unmarkSkill('shengdun');
			}
		},
		jingmeng:{
			trigger:{player:'useCard'},
			frequent:true,
			filter:function(event,player){
				return _status.currentPhase==player&&get.cardCount(true,player)==1;
			},
			content:function(){
				var type=get.type(trigger.card);
				var card=get.cardPile(function(card){
					return get.type(card)==type;
				});
				if(card){
					player.gain(card,'gain2');
					game.log(get.translation(player)+'获得了'+get.translation(card));
				}
			},
			ai:{
				threaten:1.1
			}
		},
		kuixin:{
			trigger:{player:'phaseEnd'},
			direct:true,
			filter:function(event,player){
				var nh=player.num('h');
				var nm=1;
				for(var i=0;i<game.players.length;i++){
					var target=game.players[i];
					if(target!=player&&Math.abs(target.num('h')-nh)<=nm){
						return true;
					}
				}
				return false;
			},
			content:function(){
				'step 0'
				var nh=player.num('h');
				var nm=1;
				var check=true;
				if(player.num('h','tao')){
					check=false;
				}
				else if(player.num('h','shan')&&player.num('h','wuxie')){
					check=false;
				}
				player.chooseTarget('是否发动【窥心】？',function(card,player,target){
					return target!=player&&Math.abs(target.num('h')-nh)<=nm;
				}).ai=function(target){
					if(!check) return 0;
					if(ai.get.attitude(player,target)<0){
						return target.num('h')-nh;
					}
					return 0;
				};
				'step 1'
				if(result.bool){
					var target=result.targets[0];
					player.logSkill('kuixin',result.targets);
					var cards0=target.get('h');
					var cards1=player.get('h');
					target.gain(cards1);
					player.gain(cards0);
					target.$give(cards0.length,player);
					player.$give(cards1.length,target);
				}
			},
			ai:{
				expose:0.2,
				threaten:1.5
			}
		},
		lianzhan:{
			trigger:{player:'phaseUseEnd'},
			frequent:true,
			filter:function(event,player){
				return get.cardCount(true,player)>0;
			},
			content:function(){
				player.draw(get.cardCount(true,player));
			},
			ai:{
				threaten:1.3
			}
		},
		bingshuang:{
			trigger:{source:'damageEnd'},
			filter:function(event,player){
				return event.card&&get.type(event.card)=='trick'&&
				event.player.isAlive()&&!event.player.isTurnedOver();
			},
			prompt:function(event,player){
				return '是否对'+get.translation(event.player)+'发动【冰霜】？';
			},
			check:function(event,player){
				return ai.get.attitude(player,event.player)<=0;
			},
			content:function(){
				trigger.player.draw(2);
				trigger.player.turnOver();
			}
		},
		yanshu:{
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return player.num('h',{type:'basic'})<player.num('h');
			},
			filterCard:function(card){
				return get.type(card)!='basic';
			},
			check:function(card){
				return 6-ai.get.value(card);
			},
			content:function(){
				var card=cards[0];
				var card2=get.cardPile('liuxinghuoyu');
				if(!card2){
					card2=game.createCard('liuxinghuoyu',get.suit(card),get.number(card));
				}
				player.gain(card2,'gain2');
			},
			ai:{
				order:9,
				result:{
					player:1
				},
				threaten:2
			}
		},
		shengyan:{
			trigger:{global:'recoverEnd'},
			filter:function(event,player){
				return !player.skills.contains('shengyan2')&&event.player.hp<event.player.maxHp;
			},
			prompt:function(event,player){
				return '是否对'+get.translation(event.player)+'发动【圣言】？';
			},
			check:function(event,player){
				return ai.get.attitude(player,event.player)>0;
			},
			content:function(){
				trigger.player.recover();
				player.addTempSkill('shengyan2','phaseAfter');
			},
			ai:{
				expose:0.2
			}
		},
		shengyan2:{},
		liechao:{
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return !player.isTurnedOver()&&player.num('h')<=player.hp;
			},
			content:function(){
				player.draw(4);
				player.turnOver();
				player.skip('phaseDiscard');
			},
			ai:{
				order:10,
				result:{
					player:1
				}
			}
		},
		qingliu:{
			trigger:{player:'damageBefore'},
			filter:function(event){
				return event.nature=='fire';
			},
			forced:true,
			content:function(){
				trigger.untrigger();
				trigger.finish();
			},
			ai:{
				nofire:true,
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'fireDamage')) return 0;
					}
				}
			}
		},
		zhongjia:{
			trigger:{player:'damageEnd'},
			forced:true,
			filter:function(event){
				return event.num>0;
			},
			content:function(){
				player.changeHujia();
			},
			ai:{
				nohujia:true,
				skillTagFilter:function(player){
					return player.hp>1;
				},
				threaten:function(player,target){
					if(!target.hujia) return 0.8;
				},
				effect:{
					target:function(card,player){
						if(get.tag(card,'damage')){
							if(player.skills.contains('jueqing')) return [1,-1];
							return 0.8;
						}
					}
				}
			}
		},
		dunji:{
			enable:'phaseUse',
			filter:function(event,player){
				return player.hujia?true:false;
			},
			filterTarget:function(card,player,target){
				return player!=target;
			},
			selectTarget:function(){
				return [1,_status.event.player.hujia];
			},
			content:function(){
				if(target==targets[0]){
					player.changeHujia(-player.hujia);
				}
				target.damage();
			},
			ai:{
				order:9,
				result:{
					target:function(player,target){
						return ai.get.damageEffect(target,player,target)+0.5;
					}
				}
			}
		},
		fengxing:{
			trigger:{player:['useCard']},
			frequent:true,
			filter:function(event){
				return event.card&&event.card.name=='sha';
			},
			content:function(){
				player.draw();
			}
		},
		fengxian:{
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return target.num('h')>0;
			},
			selectTarget:-1,
			content:function(){
				target.chooseToDiscard(true);
			},
			ai:{
				order:8,
				result:{
					target:function(player,target){
						var nh=target.num('h');
						switch(nh){
							case 0:return 0;
							case 1:return -1.5;
							case 2:return -1.3;
							case 3:return -1;
							default:return -0.8;
						}
					}
				}
			}
		},
		qiaodong:{
			enable:['chooseToRespond'],
			filterCard:{type:'equip'},
			filter:function(event,player){
				return player.num('he',{type:'equip'})>0;
			},
			viewAs:{name:'shan'},
			position:'he',
			prompt:'将一张装备牌当闪使用或打出',
			check:function(){return 1},
			ai:{
				respondShan:true,
				skillTagFilter:function(player){
					if(!player.num('he',{type:'equip'})) return false;
				}
			}
		},
		zhanhou:{
			init:function(player){
				player.forcemin=true;
			},
			enable:'phaseUse',
			filterCard:{type:'equip'},
			filter:function(event,player){
				return player.num('h',{type:'equip'})>0;
			},
			check:function(){
				return 1;
			},
			content:function(){
				player.changeHujia();
			},
			ai:{
				order:2,
				result:{
					player:1
				}
			},
			mod:{
				globalFrom:function(from,to,distance){
					return distance-from.hujia;
				}
			},
		},
		shijie:{
			trigger:{player:'phaseEnd'},
			direct:true,
			filter:function(event,player){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player&&game.players[i].num('h')){
						return true;
					}
				}
				return false;
			},
			content:function(){
				'step 0'
				player.chooseTarget('是否发动【视界】',function(card,player,target){
					return player!=target&&target.num('h')>0;
				}).ai=function(target){
					return 11-ai.get.attitude(player,target);
				};
				'step 1'
				if(result.bool){
					player.logSkill('shijie',result.targets);
					var target=result.targets[0];
					player.gain(target.get('h').randomGet());
					event.target=target;
					target.$give(1,player);
					game.delay();
					event.target.draw();
				}
			},
			ai:{
				expose:0.1
			}
		},
		shengguang:{
			enable:'phaseUse',
			filterCard:{color:'red'},
			filter:function(event,player){
				return player.num('he',{color:'red'})>0;
			},
			position:'he',
			usable:1,
			check:function(card){
				return 9-ai.get.value(card)
			},
			filterTarget:function(card,player,target){
				if(player.storage.anying) return true;
				if(target.hp>=target.maxHp) return false;
				return true;
			},
			content:function(){
				'step 0'
				if(player.storage.anying){
					target.loseHp();
					event.finish();
				}
				else{
					target.recover();
				}
				'step 1'
				if(target.hp<target.maxHp){
					target.draw();
				}
			},
			ai:{
				order:9,
				result:{
					target:function(player,target){
						if(player.storage.anying) return -1;
						if(target.hp==1) return 5;
						if(player==target&&player.num('h')>player.hp) return 5;
						return 2;
					}
				},
				threaten:2,
				expose:0.2
			}
		},
		xinci:{
			enable:'phaseUse',
			filterCard:{color:'black'},
			filter:function(event,player){
				return player.num('he',{color:'black'})>0;
			},
			position:'he',
			usable:1,
			mark:true,
			intro:{
				content:'已进入暗影形态'
			},
			check:function(card){
				return 9-ai.get.value(card)
			},
			filterTarget:true,
			content:function(){
				target.loseHp();
			},
			ai:{
				order:9,
				result:{
					target:-1
				},
				threaten:2,
				expose:0.2
			}
		},
		anying:{
			unique:true,
			enable:'phaseUse',
			filter:function(event,player){
				return !player.storage.anying&&player.num('he',{color:'black'})>1;
			},
			selectCard:2,
			filterCard:{color:'black'},
			position:'he',
			check:function(card){
				return 5-ai.get.value(card);
			},
			content:function(){
				player.storage.anying=true;
				player.removeSkill('shengguang');
				player.addSkill('xinci');
			},
			ai:{
				order:1,
				result:{
					player:1
				}
			}
		},
		bianxing:{
			trigger:{global:'useCard'},
			filter:function(event,player){
				if(player.skills.contains('bianxing2')) return false;
				if(event.player==player) return false;
				if(_status.currentPhase!=event.player) return false;
				if(!event.targets) return false;
				if(event.targets.length!=1) return false;
				if(event.targets[0]==event.player) return false;
				var hs=player.get('h');
				for(var i=0;i<hs.length;i++){
					if(hs[i].name!=event.card.name){
						var card=hs[i];
						if(get.type(card)=='basic'&&get.info(card.enable)){
							return true;
						}
					}
				}
				return false;
			},
			direct:true,
			content:function(){
				'step 0'
				var eff=ai.get.effect(trigger.targets[0],trigger.card,trigger.player,player);
				var att=ai.get.attitude(player,trigger.player);
				player.chooseCard('是否发动【变形】？',function(card){
					if(card.name!=trigger.card.name){
						if(get.type(card)=='basic'&&get.info(card).enable){
							return true;
						}
					}
					return false;
				}).ai=function(card){
					if(att>=0) return 0;
					if(card.name=='tao'||card.name=='caoyao'){
						if(trigger.targets[0].hp==trigger.targets[0].maxHp) return 0;
					}
					if(eff>=0) return 0;
					return ai.get.effect(trigger.targets[0],card,trigger.player,player);
				};
				'step 1'
				if(result.bool){
					var card=result.cards[0];
					player.lose(result.cards);
					event.cards=result.cards;
					player.logSkill('bianxing',trigger.player);
					game.log(get.translation(player)+'将'+get.translation(trigger.card.name)+'变为'+get.translation(result.cards));
					game.delay(0.5);
					trigger.untrigger();
					trigger.card=card;
					trigger.cards=[card];
					player.addTempSkill('bianxing2','phaseAfter');
				}
				else{
					event.finish();
				}
				'step 2'
				player.$throw(event.cards);
				game.delay();
				'step 3'
				// player.draw();
				'step 4'
				trigger.trigger('useCard');
			},
			ai:{
				expose:0.2,
				threaten:1.8
			}
		},
		bingjia:{
			enable:'phaseUse',
			filter:function(event,player){
				return !player.skills.contains('bingjia2');
			},
			filterCard:true,
			check:function(card){
				return 6-ai.get.value(card);
			},
			discard:false,
			prepare:function(cards,player){
				player.$give(1,player);
			},
			content:function(){
				player.storage.bingjia=cards[0];
				player.addSkill('bingjia2');
				game.addVideo('storage',player,['bingjia',get.cardInfo(cards[0]),'card']);
			},
			ai:{
				order:1,
				result:{
					player:1
				}
			}
		},
		bingjia2:{
			mark:true,
			trigger:{target:'useCardToBegin'},
			forced:true,
			filter:function(event,player){
				return event.player!=player&&get.suit(event.card)==get.suit(player.storage.bingjia);
			},
			content:function(){
				'step 0'
				player.showCards([player.storage.bingjia],get.translation(player)+'发动了【冰甲】');
				'step 1'
				ui.discardPile.appendChild(player.storage.bingjia);
				delete player.storage.bingjia;
				player.changeHujia();
				player.removeSkill('bingjia2');
				game.addVideo('storage',player,['bingjia',null]);
			},
			intro:{
				mark:function(dialog,content,player){
					if(player==game.me||player.isUnderControl()){
						dialog.add([player.storage.bingjia]);
					}
					else{
						return '已发动冰甲';
					}
				},
				content:function(content,player){
					if(player==game.me||player.isUnderControl()){
						return get.translation(player.storage.bingjia);
					}
					return '已发动冰甲';
				}
			}
		},
		bianxing2:{},
		moying:{
			trigger:{player:'phaseBegin'},
			skillcheck:function(event,player){
				if(!player.num('h',{suit:'spade'})) return false;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].num('j','shandian')){
						return false;
					}
				}
				return true;
			},
			forced:true,
			check:function(){
				return false;
			},
			content:function(){
				'step 0'
				if(!lib.skill.moying.skillcheck(trigger,player)){
					player.draw();
					event.finish();
					return;
				}
				var card=null;
				for(var i=0;i<ui.cardPile.childNodes.length;i++){
					if(ui.cardPile.childNodes[i].name=='shandian'){
						card=ui.cardPile.childNodes[i];break;
					}
				}
				if(!card){
					for(var i=0;i<ui.discardPile.childNodes.length;i++){
						if(ui.discardPile.childNodes[i].name=='shandian'){
							card=ui.discardPile.childNodes[i];break;
						}
					}
				}
				if(card){
					player.addJudge(card);
				}
				else{
					event.finish();
				}
				'step 1'
				game.delay();
			},
			ai:{
				threaten:1.5
			}
		},
		mdzhoufu:{
			enable:'phaseUse',
			filterCard:{color:'black'},
			filter:function(event,player){
				return player.num('h',{color:'black'})>0;
			},
			filterTarget:function(card,player,target){
				return player!=target&&!target.skills.contains('mdzhoufu2');
			},
			prepare:function(cards,player){
				player.$throw(cards);
			},
			discard:false,
			content:function(){
				target.$gain2(cards);
				target.storage.mdzhoufu2=cards[0];
				target.addSkill('mdzhoufu2');
				target.storage.mdzhoufu3=player;
				game.addVideo('storage',target,['mdzhoufu2',get.cardInfo(cards[0]),'card']);
				ui.special.appendChild(cards[0]);
			},
			check:function(card){
				if(get.suit(card)=='spade'&&card.number>=2&&card.number<=9){
					return 6-ai.get.value(card);
				}
				return -1;
			},
			ai:{
				tag:{
					rejudge:0.1,
				},
				threaten:1.5,
				expose:0.1,
				order:10,
				result:{
					target:-1
				}
			}
		},
		mdzhoufu2:{
			trigger:{player:'judge'},
			forced:true,
			priority:10,
			mark:'card',
			content:function(){
				"step 0"
				ui.discardPile.appendChild(player.storage.mdzhoufu2);
				player.$throw(player.storage.mdzhoufu2);
				if(player.storage.mdzhoufu2.clone){
					player.storage.mdzhoufu2.clone.classList.add('thrownhighlight');
					game.addVideo('highlightnode',player,get.cardInfo(player.storage.mdzhoufu2));
				}
				if(player.storage.mdzhoufu3.isAlive()){
					// player.storage.mdzhoufu3.draw();
					player.storage.mdzhoufu3.gain(player.judging,'gain2');
				}
				else{
					game.delay(1.5);
				}
				"step 1"
				player.judging=player.storage.mdzhoufu2;
				trigger.position.appendChild(player.storage.mdzhoufu2);
				// trigger.untrigger();
				game.log(get.translation(player)+'的判定牌改为'+get.translation(player.storage.mdzhoufu2));
				player.removeSkill('mdzhoufu2');
				delete player.storage.mdzhoufu2;
				delete player.storage.mdzhoufu3;
			},
			intro:{
				content:'card'
			},
		},
		moying_old:{
			trigger:{player:'damageEnd',source:'damageEnd'},
			check:function(event,player){
				var target=(player==event.player)?event.source:event.player;
				return ai.get.attitude(player,target)<0;
			},
			filter:function(event,player){
				var target=(player==event.player)?event.source:event.player;
				return target.isAlive();
			},
			prompt:function(event,player){
				var target=(player==event.player)?event.source:event.player;
				return '是否对'+get.translation(target)+'发动【魔影】？';
			},
			content:function(){
				"step 0"
				event.target=(player==trigger.player)?trigger.source:trigger.player;
				event.target.judge(function(card){
					return get.color(card)=='black'?-1:0;
				});
				"step 1"
				if(result.color=='black'){
					event.target.loseHp();
				}
			},
			ai:{
				expose:0.1,
				threaten:1.3
			}
		},
		xianzhi:{
			trigger:{global:'judgeBegin'},
			direct:true,
			filter:function(){
				return ui.cardPile.childNodes.length>1;
			},
			content:function(){
				'step 0'
				var str='';
				if(trigger.card) str=get.translation(trigger.card.viewAs||trigger.card.name);
				else if(trigger.skill) str=get.translation(trigger.skill);
				else str=get.translation(trigger.parent.name);

				var cards=[ui.cardPile.childNodes[0],ui.cardPile.childNodes[1]];
				var att=ai.get.attitude(player,trigger.player);
				var delta=trigger.judge(ui.cardPile.childNodes[1])-trigger.judge(ui.cardPile.childNodes[0]);
				player.chooseControl('调换顺序','cancel',
				ui.create.dialog('先知：'+get.translation(trigger.player)+'的'+str+'判定',cards,'hidden')).ai=function(){
					if(att*delta>0) return '调换顺序';
					else return 'cancel';
				};
				'step 1'
				if(result.control=='调换顺序'){
					player.logSkill('xianzhi');
					var card=ui.cardPile.firstChild;
					ui.cardPile.removeChild(card);
					ui.cardPile.insertBefore(card,ui.cardPile.firstChild.nextSibling);
					game.log(get.translation(player)+'调换了牌堆顶两张牌的顺序');
				}
			},
			ai:{
				expose:0.1,
				tag:{
					rejudge:0.5
				}
			}
		},
		jingxiang:{
			trigger:{player:'chooseToRespondBegin'},
			direct:true,
			filter:function(event,player){
				if(event.responded) return false;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player&&game.players[i].num('h')){
						return true;
					}
				}
				return false;
			},
			content:function(){
				"step 0"
				var players=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player&&game.players[i].num('h')){
						players.push(game.players[i]);
					}
				}
				if(!players.length){
					event.finish();
					return;
				}
				var target=players.randomGet();
				event.target=target;
				var cards=target.get('h');
				player.chooseCardButton('镜像：选择'+get.translation(target)+'的一张卡手牌打出',cards).filterButton=function(button){
					return trigger.filterCard(button.link);
				}
				"step 1"
				if(result.bool){
					player.logSkill('jingxiang',event.target);
					event.target.lose(result.links);
					trigger.untrigger();
					trigger.responded=true;
					result.buttons[0].link.remove();
					trigger.result={bool:true,card:result.buttons[0].link}
				}
			},
			ai:{
				effect:{
					target:function(card){
						if(get.tag(card,'respondShan')) return 0.7;
						if(get.tag(card,'respondSha')) return 0.7;
					}
				}
			},
		},
		wlianji:{
			trigger:{player:'phaseEnd'},
			frequent:true,
			filter:function(event,player){
				return get.cardCount(true,player)>player.hp;
			},
			content:function(){
				player.draw(2);
			},
			init:function(player){player.storage.jingce=true},
			intro:{
				content:function(storage,player){
					if(_status.currentPhase==player) return '已使用'+get.cardCount(true,player)+'张牌';
				}
			}
		},
		mengun:{
			trigger:{global:'useCardToBefore'},
			priority:12,
			filter:function(event,player){
				if(event.player==player) return false;
				if(_status.currentPhase!=event.player) return false;
				if(event.player.skills.contains('mengun2')) return false;
				if(get.itemtype(event.card)!='card') return false;
				if(!player.num('h',{suit:get.suit(event.card)})) return false;
				return get.type(event.card)=='basic';
			},
			direct:true,
			content:function(){
				"step 0"
				var val=ai.get.value(trigger.card);
				var suit=get.suit(trigger.card);
				var eff=ai.get.effect(trigger.target,trigger.card,trigger.player,player);
				player.chooseToDiscard('是否对'+get.translation(trigger.player)+'使用的'+get.translation(trigger.card)+'发动【闷棍】？',function(card){
					return get.suit(card)==suit;
				}).ai=function(card){
					if(eff>=0) return 0;
					return Math.min(8,1+val)-ai.get.value(card);
				}
				"step 1"
				if(result.bool){
					player.logSkill('mengun',trigger.player);
					game.log(get.translation(trigger.player)+'收回了'+get.translation(trigger.cards));
					trigger.untrigger();
					trigger.finish();
					game.delay();
				}
				else{
					event.finish();
				}
				"step 2"
				trigger.player.$gain2(trigger.cards);
				trigger.player.gain(trigger.cards);
				trigger.player.storage.mengun2=trigger.cards[0];
				game.addVideo('storage',player,['mengun2',get.cardInfo(trigger.cards[0]),'card']);
				trigger.player.addTempSkill('mengun2','phaseEnd');
			}
		},
		mengun2:{
			mark:'card',
			mod:{
				cardEnabled:function(card,player){
					if(card==player.storage.mengun2) return false;
				},
			},
			intro:{
				content:'card',
				onunmark:function(storage,player){
					delete player.storage.mengun2;
				}
			},
		},
		jianren:{
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return player.get('e','1')?true:false;
			},
			filterCard:function(card,player){
				return card==player.get('e','1');
			},
			position:'e',
			filterTarget:function(card,player,target){
				return target!=player;
			},
			selectCard:-1,
			selectTarget:-1,
			content:function(){
				target.damage();
			},
			ai:{
				order:9,
				result:{
					target:function(player,target){
						return ai.get.damageEffect(target,player,target);
					}
				}
			}
		},
		jihuo:{
			trigger:{player:'phaseEnd'},
			filter:function(event,player){
				return !player.storage.jihuo&&player.num('h')>0;
			},
			direct:true,
			content:function(){
				"step 0"
				player.chooseToDiscard('是否发动【激活】？').ai=ai.get.unuseful2;
				"step 1"
				if(result.bool){
					player.logSkill('jihuo');
					player.storage.jihuo=true;
				}
				else{
					event.finish();
				}
				"step 2"
				player.phase();
				"step 3"
				player.storage.jihuo=false;
			},
			ai:{
				threaten:1.2
			}
		},
		tzhenji:{
			trigger:{player:'discardAfter'},
			direct:true,
			filter:function(event,player){
				if(player.skills.contains('tzhenji2')){
					return false;
				}
				if(event.cards){
					for(var i=0;i<event.cards.length;i++){
						if(get.color(event.cards[i])=='black') return true;
					}
				}
				return false;
			},
			content:function(){
				"step 0";
				player.chooseTarget('是否发动【震击】？').ai=function(target){
					var bool=ai.get.attitude(player,target)>0;
					return ai.get.damageEffect(target,player,player,'thunder')-(bool?1:0);
				};
				"step 1"
				if(result.bool){
					game.delay(0.5);
					var target=result.targets[0];
					player.logSkill('tzhenji',target,'thunder');
					var cs=target.get('he');
					if(cs.length){
						target.discard(cs.randomGet());
					}
					target.damage('thunder');
					player.addTempSkill('tzhenji2','phaseAfter');
				}
			},
			ai:{
				threaten:1.2,
				expose:0.3,
				effect:{
					target:function(card,player,target){
						if(get.tag(card,'loseCard')&&target.num('he')){
							return 0.7;
						}
					}
				},
			}
		},
		tzhenji2:{},
		zuling:{
			trigger:{player:'phaseBegin'},
			forced:true,
			filter:function(event,player){
				if(player.storage.zuling) return false;
				var rand=['tuteng1','tuteng2','tuteng3','tuteng4'];
				var num=0;
				for(var i=0;i<player.skills.length;i++){
					if(rand.contains(player.skills[i])) num++;
					if(num>=3) return true;
				}
				return false;
			},
			content:function(){
				var rand=['tuteng1','tuteng2','tuteng3','tuteng4'];
				for(var i=0;i<rand.length;i++){
					player.removeSkill(rand[i]);
				}
				player.storage.zuling=true;
			}
		},
		tzhenji_old:{
			trigger:{player:['useCard','respondEnd']},
			filter:function(event){
				return get.suit(event.card)=='spade';
			},
			direct:true,
			content:function(){
				"step 0";
				player.chooseTarget('是否发动【震击】？').ai=function(target){
					return ai.get.damageEffect(target,player,player,'thunder')-1;
				};
				"step 1"
				if(result.bool){
					player.logSkill('tzhenji',result.targets,'thunder');
					event.target=result.targets[0];
					event.target.judge();
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.color=='red'){
					event.target.damage('fire');
				}
				else{
					event.target.damage('thunder');
					var cs=event.target.get('he');
					if(cs.length){
						event.target.discard(cs.randomGet());
					}
					cs=player.get('he');
					if(cs.length){
						player.discard(cs.randomGet());
					}
				}
			},
			ai:{
				expose:0.2,
				threaten:1.2,
				effect_old:{
					target:function(card,player,target){
						if(get.tag(card,'respondShan')){
							var hastarget=false;
							for(var i=0;i<game.players.length;i++){
								if(ai.get.attitude(target,game.players[i])<0){
									hastarget=true;break;
								}
							}
							var ns=target.num('h','shan');
							var nh=target.num('h');
							if(ns>1){
								return [0,hastarget?1:0];
							}
							if(ns&&nh>=2){
								return [0,0];
							}
							if(nh>3){
								return [0,0];
							}
							if(nh==0){
								return 1.5;
							}
							return [1,0.05];
						}
					}
				}
			}
		},
		tuteng_s:{
			trigger:{player:'phaseUseBegin'},
			forced:true,
			filter:function(event,player){
				var rand=['tuteng1','tuteng2','tuteng3','tuteng4'];
				for(var i=0;i<player.skills.length;i++){
					rand.remove(player.skills[i]);
					if(rand.length==0) return false;
				}
				return true;
			},
			content:function(){
				var rand=['tuteng1','tuteng2','tuteng3','tuteng4'];
				for(var i=0;i<player.skills.length;i++){
					rand.remove(player.skills[i]);
				}
				if(rand.length){
					player.addSkill(rand.randomGet());
				}
			},
			ai:{
				effect:function(card,player){
					if(get.tag(card,'damage')){
						if(player.skills.contains('jueqing')) return [1,1];
						return 1.2;
					}
				},
				threaten:1.3
			},
			group:'tuteng_lose'
		},
		s_tuteng:{
			trigger:{player:'phaseBegin'},
			forced:true,
			unique:true,
			content:function(){
				var rand=['tuteng1','tuteng2','tuteng4',
				'tuteng5','tuteng6','tuteng7'];
				if(player.storage.s_tuteng){

					var rand2=player.storage.s_tuteng;
					for(var i=0;i<3;i++){
						rand.remove(rand2[i]);
					}
					player.removeSkill(rand2.randomRemove());
					var totem=rand.randomGet();
					rand2.push(totem);
					player.addSkill(totem);
				}
				else{
					for(var i=0;i<3;i++){
						rand.randomRemove();
					}
					for(var i=0;i<3;i++){
						player.addSkill(rand[i]);
					}
					player.storage.s_tuteng=rand;
				}
			},
			ai:{
				threaten:2
			}
		},
		tuteng:{
			enable:'phaseUse',
			usable:1,
			unique:true,
			direct:true,
			check:function(){
				return 0;
			},
			delay:0,
			init:function(){
				for(var i=1;i<=8;i++){
					lib.translate['tuteng'+i+'_info']=lib.skill['tuteng'+i].intro.content;
				}
			},
			position:'he',
			content:function(){
				'step 0'
				var rand=['tuteng1','tuteng2','tuteng3','tuteng4'];
				var rand2=[];
				var randx=[];
				var rand2x=[];
				if(player.storage.tuteng_awake){
					rand=rand.concat(['tuteng5','tuteng6','tuteng7','tuteng8']);
				}
				for(var i=0;i<player.skills.length;i++){
					if(rand.contains(player.skills[i])){
						rand.remove(player.skills[i]);
						rand2.push(player.skills[i]);
					}
				}
				if(rand.length){
					if(event.isMine()&&rand.length>1){
						var dialog=ui.create.dialog();
						for(var i=0;i<rand.length;i++){
							randx[i]=['','',rand[i]];
						}
						for(var i=0;i<rand2.length;i++){
							rand2x[i]=['','',rand2[i]];
						}
						dialog.add('选择一个图腾');
						dialog.add([randx,'vcard']);
						if(rand2.length>=3){
							dialog.add('替换一个已有图腾');
							dialog.add([rand2x,'vcard']);
							player.chooseButton(dialog,2,true).filterButton=function(button){
								if(ui.selected.buttons.length){
									var current=ui.selected.buttons[0].name;
									if(rand.contains(current)){
										return rand2.contains(button.name);
									}
									else{
										return rand.contains(button.name);
									}
								}
								return true;
							};
						}
						else{
							player.chooseButton(dialog,true);
						}
						for(var i=0;i<dialog.buttons.length;i++){
							var item=dialog.buttons[i]
							if(i==4){
								item.parentNode.insertBefore(document.createElement('br'),item);
							}
							item.style.zoom=0.7;
						}
					}
					else{
						if(player.hp<player.maxHp&&rand.contains('tuteng1')){
							player.addSkill('tuteng1');
						}
						else{
							if(rand.length>1){
								rand.remove('tuteng1');
							}
							player.addSkill(rand.randomGet());
						}
						if(rand2.length>=3){
							player.removeSkill(rand2.randomGet());
						}
						game.delay();
						event.finish();
					}
				}
				else{
					event.finish();
				}
				'step 1'
				if(result.buttons.length==1){
					player.addSkill(result.buttons[0].name);
				}
				else if(result.buttons.length==2){
					var skill1=result.buttons[0].name;
					var skill2=result.buttons[1].name;
					if(player.skills.contains(skill1)){
						player.removeSkill(skill1);
						player.addSkill(skill2);
					}
					else{
						player.removeSkill(skill2);
						player.addSkill(skill1);
					}
				}
				player.addSkill(event.choice);
				if(!player.storage.tuteng_awake){
					var rand=['tuteng1','tuteng2','tuteng3','tuteng4',
					'tuteng5','tuteng6','tuteng7','tuteng8'];
					var num=0;
					for(var i=0;i<player.skills.length;i++){
						if(rand.contains(player.skills[i])) num++;
						if(num>=3){
							player.storage.tuteng_awake=true;
							player.popup('图腾已解锁');
							break;
						}
					}
				}
			},
			ai:{
				order:11,
				result:{
					player:1
				},
				effect:function(card,player){
					if(get.tag(card,'damage')){
						if(player.skills.contains('jueqing')) return;
						return 1.2;
					}
				},
				threaten:1.3
			},
			group:'tuteng_lose'
		},
		tuteng_h:{
			mod:{
				maxHandcard:function(player,num){
					return num-1;
				}
			}
		},
		tuteng_lose:{
			trigger:{player:'damageEnd'},
			forced:true,
			popup:false,
			filter:function(event,player){
				var tuteng=['tuteng1','tuteng2','tuteng3','tuteng4',
				'tuteng5','tuteng6','tuteng7','tuteng8'];
				for(var i=0;i<player.skills.length;i++){
					if(tuteng.contains(player.skills[i])) return true;
				}
				return false;
			},
			content:function(){
				var tuteng=['tuteng1','tuteng2','tuteng3','tuteng4',
				'tuteng5','tuteng6','tuteng7','tuteng8'];
				var rand=[];
				for(var i=0;i<player.skills.length;i++){
					if(tuteng.contains(player.skills[i])){
						rand.push(player.skills[i]);
					}
				}
				if(rand.length){
					player.removeSkill(rand.randomGet());
				}
			}
		},
		tuteng1:{
			mark:'image',
			nopop:true,
			intro:{
				content:'回合结束阶段，你回复一点体力'
			},
			trigger:{player:'phaseEnd'},
			forced:true,
			filter:function(event,player){
				return player.hp<player.maxHp;
			},
			content:function(){
				player.recover();
			}
		},
		tuteng2:{
			mark:'image',
			nopop:true,
			intro:{
				content:'每当你造成一点伤害，你摸一张牌'
			},
			filter:function(event){
				return event.num>0;
			},
			trigger:{source:'damageAfter'},
			forced:true,
			content:function(){
				player.draw(trigger.num);
			}
		},
		tuteng3:{
			mark:'image',
			nopop:true,
			intro:{
				content:'你受到的伤害-1'
			},
			trigger:{player:'damageBegin'},
			forced:true,
			filter:function(event){
				return event.num>0;
			},
			content:function(){
				trigger.num--;
			},
		},
		tuteng4:{
			mark:'image',
			nopop:true,
			intro:{
				content:'你的锦囊牌造成的伤害+1'
			},
			trigger:{source:'damageBegin'},
			forced:true,
			filter:function(event){
				return event.card&&get.type(event.card)=='trick'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
			},
			content:function(){
				trigger.num++;
			}
		},
		tuteng5:{
			mark:'image',
			nopop:true,
			intro:{
				content:'回合结束阶段，你摸一张牌'
			},
			trigger:{player:'phaseEnd'},
			forced:true,
			content:function(){
				player.draw();
			}
		},
		tuteng6:{
			mark:'image',
			nopop:true,
			intro:{
				content:'你的杀造成的伤害+1'
			},
			trigger:{source:'damageBegin'},
			forced:true,
			filter:function(event){
				return event.card&&event.card.name=='sha'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
			},
			content:function(){
				trigger.num++;
			}
		},
		tuteng7:{
			mark:'image',
			nopop:true,
			intro:{
				content:'回合结束阶段，你令一名其他角色回复一点体力'
			},
			trigger:{player:'phaseEnd'},
			direct:true,
			filter:function(event,player){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player&&game.players[i].hp<game.players[i].maxHp){
						return true;
					}
				}
				return false;
			},
			content:function(){
				'step 0'
				player.chooseTarget('活力图腾：令一名其他角色回复一点体力',function(card,player,target){
					return target!=player&&target.hp<target.maxHp;
				}).ai=function(target){
					return ai.get.recoverEffect(target,player,player);
				};
				'step 1'
				if(result.bool){
					player.logSkill('tuteng7',result.targets[0]);
					result.targets[0].recover();
				}
			}
		},
		tuteng8:{
			mark:'image',
			nopop:true,
			intro:{
				content:'当计算你与其它角色的距离时，始终-1'
			},
			mod:{
				globalFrom:function(from,to,distance){
					return distance-1;
				}
			}
		},
		fenliu:{
			enable:'phaseUse',
			prompt:'流失1点体力并摸两张牌',
			usable:1,
			content:function(){
				"step 0"
				player.loseHp(1);
				"step 1"
				player.draw(3);
			},
			ai:{
				order:1,
				result:{
					player:function(player){
						if(player.num('h')>=player.hp-1) return -1;
						if(player.hp<3) return -1;
						return 1;
					}
				},
				effect:{
					target:function(card){
						if(get.tag(card,'damage')||get.tag(card,'loseHp')){
							return 1.5;
						}
					}
				},
				threaten:1.2
			}
		},
		hongxi:{
			trigger:{global:'dieAfter'},
			filter:function(event,player){
				return player.hp<player.maxHp;
			},
			forced:true,
			content:function(){
				player.recover(player.maxHp-player.hp);
			},
			ai:{
				threaten:1.2
			}
		},
	},
	card:{
		tuteng1:{
			image:'card/tuteng1',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng2:{
			image:'card/tuteng2',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng3:{
			image:'card/tuteng3',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng4:{
			image:'card/tuteng4',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng5:{
			image:'card/tuteng5',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng6:{
			image:'card/tuteng6',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng7:{
			image:'card/tuteng7',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
		tuteng8:{
			image:'card/tuteng8',
			color:'white',
			noname:true,
			textShadow:'black 0 0 2px',
		},
	},
	translate:{
		hs_alleria:'奥蕾莉亚',
		hs_magni:'麦格尼',
		hs_medivh:'麦迪文',
		hs_jaina:'吉安娜',
		hs_lrexxar:'雷克萨',
		hs_wuther:'乌瑟尔',
		hs_jgarrosh:'加尔鲁什',
		hs_malfurion:'玛法里奥',
		hs_guldan:'古尔丹',
		hs_anduin:'安度因',
		hs_sthrall:'萨尔',
		hs_waleera:'瓦莉拉',

		hs_neptulon:'耐普图隆',
		hs_wvelen:'维纶',
		hs_antonidas:'安东尼达斯',
		hs_alakir:'奥拉基尔',
		hs_zhouzhuo:'周卓',
		hs_yngvar:'伊戈瓦尔',
		hs_bchillmaw:'冰喉',
		hs_malorne:'玛洛恩',
		hs_xsylvanas:'希尔瓦娜斯',
		hs_siwangzhiyi:'死亡之翼',
		hs_malygos:'玛里苟斯',
		hs_xuefashi:'血法师',

		hs_ronghejuren:'熔核巨人',
		hs_edwin:'艾德温',
		hs_mijiaojisi:'秘教祭司',
		hs_huzhixiannv:'湖之仙女',
		hs_tgolem:'图腾魔像',
		hs_totemic:'图腾师',
		hs_bilanyoulong:'碧蓝幼龙',

		xjumo:'聚魔',
		xjumo_info:'锁定技，你的手牌上限+3',
		liehun:'裂魂',
		liehun_info:'锁定技，出牌阶段开始时，你获得手牌中所有非基本牌的复制',
		malymowang:'魔网',
		malymowang_info:'锁定技，你的锦囊牌造成的伤害+1；出牌阶段开始时，你观看随机3张锦囊牌，并将其中一张加入你的手牌',
		lingzhou:'灵咒',
		lingzhou_info:'每当你使用一张锦囊牌，可令一名角色摸一张牌或回复一点体力',
		mieshi:'灭世',
		mieshi_info:'锁定技，回合结束阶段，你流失一点体力，并对一名随机的其他角色造成一点火焰伤害',
		shixin:'蚀心',
		shixin_info:'锁定技，每当你对一名其他角色造成一次伤害，受伤害角色与你各流失一点体力',
		xmojian:'魔箭',
		xmojian_info:'每当你翻面时，你可以指定一名角色视为对其使用了一张杀，每回合最多发动一次',
		enze:'恩泽',
		enze_info:'出牌阶段限一次，你可以指定一名角色令其手牌数与你相等',
		chongsheng:'重生',
		chongsheng_bg:'生',
		chongsheng_info:'濒死阶段，你可弃置所有牌，将体力回复至2-X，并摸X张牌，X为你本局发动此技能的次数。每局最多发动2次',
		s_tuteng:'滋养',
		s_tuteng_info:'在你首个回合开始时，你获得三个随机图腾；在此后的每个回合开始阶段，你随机替换其中的一个图腾',
		guozai:'过载',
		guozai2:'过载',
		guozai2_bg:'载',
		guozai_info:'出牌阶段限一次，你可将手牌补至四张，并于此阶段结束时弃置等量的牌',
		hanshuang:'寒霜',
		hanshuang_info:'锁定技，你使用黑色牌造成伤害后，受伤害角色须将武将牌翻至背面，然后你流失一点体力',
		bingshi:'冰噬',
		bingshi_info:'锁定技，你死亡时，对所有其他角色造成一点伤害',
		huanwu:'唤雾',
		huanwu_info:'出牌阶段限一次，你可以令一名角色增加一点体力上限，回复一点体力，并摸两张牌（每名角色限发动一次）',
		fengnu:'风怒',
		fengnu_info:'锁定技，你使用的任何卡牌无数量及距离限制；当你于回合内重复使用同名卡牌时，你摸一张牌',
		shengdun:'圣盾',
		shengdun2:'圣盾',
		shengdun_info:'锁定技，回合开始阶段，若你没有护甲，你获得一点护甲',
		jingmeng:'镜梦',
		jingmeng_info:'每当你于回合内使用第一张牌时，你可以从牌堆中随机获得一张与之类型相同的牌',
		kuixin:'窥心',
		kuixin_info:'回合结束阶段，你可以将你的手牌与一名其他角色交换（手牌数之差不能多于1）',
		lianzhan:'连斩',
		lianzhan_info:'出牌阶段结束时，你可以摸X张牌，X为你本回合使用的卡牌数',
		yanshu:'炎术',
		yanshu_info:'出牌阶段限一次，你可以弃置一张非基本牌，并获得一张流星火雨',
		bingshuang:'冰霜',
		bingshuang_info:'你使用锦囊牌造成伤害后，可令目标摸两张牌并翻面',
		shengyan:'圣言',
		shengyan_info:'任意一名角色回复体力后，你可以令其额外回复一点体力，每回合限发动一次',
		qingliu:'清流',
		qingliu_info:'锁定技，你防止即将受到的火焰伤害',
		liechao:'猎潮',
		liechao_info:'出牌阶阶段限一次，若你的武将牌正面朝上且手牌数不大于当前体力值，你可以翻面并摸四张牌，若如此做，你跳过本回合的弃牌阶段',

		fengxing:'风行',
		fengxing_info:'每当你使用一张杀，你可以摸一张牌',
		xinci:'心刺',
		xinci_info:'出牌阶段限一次，你可以弃置一张黑色牌令一名角色流失一点体力',
		zhongjia:'重甲',
		zhongjia_info:'锁定技，每当你受到一次伤害，你获得一点护甲值；当你的体力值大于1时，你的护甲不为你抵挡伤害',
		dunji:'盾击',
		dunji_info:'出牌阶段，你可以失去你的所有护甲，并对等量的其他角色各造成一点伤害',
		qiaodong:'巧动',
		qiaodong_info:'你可以将一张装备牌当作闪使用或打出',
		fengxian:'奉献',
		fengxian_info:'出牌阶段限一次，你可以令场上所有角色各弃置一张手牌',
		zhanhou:'战吼',
		zhanhou_info:'锁定技，你没有装备区，你可以弃置一张装备牌并获得一点护甲值；每有一点护甲值，你与其他角色的距离-1',
		anying:'暗影',
		anying_info:'限定技，出牌阶段，你可以弃置两张黑色牌，失去技能圣光，并获得技能心刺',
		shijie:'视界',
		shijie_info:'回合结束阶段，你可以获得一名其他角色的一张手牌，然后该角色摸一张牌',
		shengguang:'圣光',
		shengguang_info:'出牌阶段限一次，你可以弃置一张红色牌令一名角色回复一点体力，若其仍处于受伤状态则摸一张牌',
		bingjia:'冰甲',
		bingjia2:'冰甲',
		bingjia_info:'出牌阶段，若你武将牌上没有牌，你可以将一张手牌背面朝上置于你的武将牌上，当你成为其他角色的与此牌花色相同的牌的目标时，你将此牌置于弃牌堆，并获得一点护甲值',
		bianxing:'变形',
		bianxing_info:'当一其他角色于回合内使用卡牌指定了惟一的其他目标后，你可以用一张合理的基本牌替代此牌，每名角色的回合限一次',
		xianzhi:'先知',
		xianzhi_info:'任意一名角色进行判定前，你可以观看牌堆顶的两张牌，并可以将其调换顺序',
		mdzhoufu:'缚魂',
		mdzhoufu2:'缚魂',
		mdzhoufu_info:'出牌阶段，你可以将一张黑色手牌置于一名其他角色的武将牌上，在其判定时以此牌作为判定结果，然后你获得亮出的判定牌',
		moying:'诅咒',
		moying_info:'锁定技，回合开始阶段，若场上没有闪电且你手牌中有黑桃牌，你将牌堆中的一张闪电置于你的判定区，否则你摸一张牌',
		moying_old_info:'每当你造成或受到一次伤害，你可以令伤害目标或来源进行一次判定，若结果为黑色，其流失一点体力',
		jingxiang:'镜像',
		jingxiang_info:'每当你需要打出卡牌时，你可以观看一名随机角色的手牌并将其视为你的手牌打出',
		tuteng:'图腾',
		tuteng_info:'出牌阶段，你可以获得一个基础图腾，当你的图腾数量达到3时，你解锁全部图腾；每当你受到一次伤害，你随机失去一个图腾',
		zuling:'祖灵',
		zuling_info:'觉醒技，回合开始阶段，若你拥有至少3个图腾，你失去所有图腾，并解锁强化图腾',
		tuteng1:'治疗图腾',
		tuteng2:'灼热图腾',
		tuteng3:'石爪图腾',
		tuteng4:'空气之怒图腾',
		tuteng5:'法力之潮图腾',
		tuteng6:'火舌图腾',
		tuteng7:'活力图腾',
		tuteng8:'图腾魔像',
		tzhenji:'震击',
		tzhenji_info:'每当你因弃置而失去黑色牌，可对一名角色造成1点雷电伤害，并随机弃置其一张牌，每回合限发动一次',
		fenliu:'分流',
		fenliu_info:'出牌阶段限一次，你可以失去一点体力并获得3张牌',
		hongxi:'虹吸',
		hongxi_info:'锁定技，每当有一名角色死亡，你将体力回复至体力上限',
		jihuo:'激活',
		jihuo_info:'回合结束阶段，你可以弃置一张手牌并进行一个额外的回合',
		jianren:'剑刃',
		jianren_info:'出牌阶段限一次，你可以弃置装备区内的武器牌，对所有其他角色造成一点伤害',
		mengun:'闷棍',
		mengun2:'闷棍',
		mengun_info:'每当一名其他角色于回合内使用基本牌，你可以弃置一张与之花色相同的牌令其收回此牌，且在本回合内不能再次使用，每回合限一次',
		wlianji:'连击',
		wlianji_info:'回合结束阶段，若你本回合使用的卡牌数大于你当前的体力值，你可以摸两张牌',
	},
}
