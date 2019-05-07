consumer_key = 'rvLuQd72dTJhAlKghafcOTlyJ'
consumer_secret = 'pJm9xjotTdSq8gbMOaAiZYQzLVbZxNZ5FcFrC7U4FXzyQEZVCs'
access_token = '958106280887021569-zW0E95npF358I0F9jZ7Fzm0q5Jl9JGx'
access_token_secret = 'MxiaM8y4JcEEuwjToXtkoum6xSuySyf0MfsnUxh4c92TL'

import tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

x = """
fearful, afraid, awkward, anxious, alarmed, apprehensive
disgusted
angry, annoyed, aggravated, Bothered, Bitter
sad
loving, affectionate
joyful, amused
"""

f = """
Angry, Annoyed, Afraid, Awkward, Affectionate, Anxious, Alarmed, Awed, Aggravated, Amazed, Astonished, Amused, Apprehensive, 
Absorbed, Ambivalent, Ashamed, Able, Addled, Admired, Admirable, Affable, Agreeable, Aggressive, Abandoned,
Brave, Bothered, Bewildered, Bitter, Bashful, Blue, Baffled, Blissful, Buoyant, Bereaved, Bold,
Cheerful, Cooperative, Confident, Calm, Cold, Curious, Content, Considerate, Cautious, Cranky, Crestfallen, Contrite, 
Chagrined, Carefree, Composed, Capable, Caring, Careful, Contemptuous, Cross, Concerned, Complacent, Charitable, Crushed, 
Cantankerous, Compulsive,
Defiant, Depressed, Discouraged, Delighted, Disgusted, Determined, Disappointed, Detached, Daring, Disillusioned, Devious, 
Dismayed, Disenchanted, Doleful, Disinterested, Disdainful, Dismissive, Dejected, Disengaged, Distant,
Elated, Enthusiastic, Embarrassed, Edgy, Excited, Envious, Exhausted, Eager, Exuberant, Enraged, Euphoric, Extravagant, 
Ecstatic, Eager, Emboldened,
Funny, Frightened, Fearful, Furious, Fair, Foolish, Frustrated, Forgiving, Flustered, Fulfilled, Fatigued,
Grouchy, Guilty, Grief-stricken, Generous, Greedy, Grateful, Grumpy, Guarded, Gleeful, Glad, Gloomy, Glum, Gracious, Grateful,
Happy, Humiliated, Hurt, Helpless, Hopeless, Horrified, Hesitant, Humbled, Heartbroken, Hysterical, Hyperactive,
Irritated, Irritable, Interested, Insecure, Impatient, Inspired, Inspiring, Inadequate, Irrational, Ignorant, Indifferent, 
Irked, Impertinent, Inquisitive, Isolated,
Jealous, Joyful, Joyous, Judgmental, Judged, Jaded, Jocular, Jittery,
Kind, Keen,
Loving, Lonely, Lackluster, Leery, Lethargic, Listless, Lazy,
Mad, Meek, Mean, Miserable, Malevolent, Marvelous, Manipulated, Manipulative, Misunderstood, Mischievous, Mopey, Melodramatic, 
Moody, Melancholy, Mirthful, Moved, Morose, Manic,
Nice, Naughty, Nasty, Nervous, Neglected, Neglectful, Needy, Needed, Naive, Nonchalant, Nonplussed, Numb,
Overpowered, Overjoyed, Obedient, Obsessive, Obsessed, Offended, Outraged, Overloaded, Overstimulated, Obstinate, Obligated, 
Optimistic, Open, Openminded,
Panicked, Panicky, Peaceful, Placid, Playful, Pensive, Puzzled, Powerful, Powerless, Pleased, Petty, Petulant, Preoccupied, 
Proud, Prideful, Prickly, Petrified, Pressured, Perturbed, Peeved, Passive,
Quirky, Quarrelsome, Qualified, Quivery, Querulous, Quiet,
Relieved, Relaxed, Resentful, Rattled, Refreshed, Repulsed, Rational, Reasonable, Reasoned, Rebellious, Reluctant, Reassured, 
Remorseful, Reserved, Rejuvenated, Restless, Rattled,
Sad, Surprised, Silly, Scared, Sorrowful, Serious, Shy, Satisfied, Sensitive, Safe, Stressed, Stubborn, Sarcastic, Spiteful, 
Scornful, Secure, Serene, Smug, Sociable, Sympathetic, Startled, Satisfied, Sanguine, Skeptical, Sincere,
Thankful, Tearful, Teary, Thoughtful, Tolerant, Tolerated, Trusted, Trusting, Trustworthy, Temperamental, Terrified, Timid, 
Tired, Tiresome, Troubled, Tickled, Torn, Touched, Threatened, Tender, Tranquil,
Uneasy, Uncertain, Uncomfortable, Unruffled, Unafraid, Useless, Useful, Unimpressed, Unappreciated, Undecided, Unruly, 
Uptight, Unnerved, Unhappy, Unsteady, Uplifted, Unsure,
Vivacious, Vain, Vibrant, Violent, Valued, Valuable, Vital, Vexed, Volatile, Vulnerable, Victorious, Victimized, Vacant,
Worried, Wary, Weak, Weary, Wistful, Wishful, Willful, Willing, Woeful, Weepy, Whiny, Worn, Whimsical, Warm, Witty, Withdrawn, 
Worthless, Wronged, Wasted, Worldly,
Youthful, Yielding, Yearning,
Zany, Zealous, Zestful
"""
a = f.lower().replace('\n','').replace(' ','').split(',')
#print(a)
len(a)

sar = [] # array
sac = 0
class MyStreamListener(tweepy.StreamListener):
    def on_status(self, status):
        global sar
        global sac
        sar.append(status)
        sac = sac + 1
        if (sac % 100) == 0:
            print(str(sac))
        if sac > 500:
            return False
        else:
            return True
myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener, tweet_mode='extended')
myStream.filter(track=a)

totals = {} 
idx = 0
for s in sar:
    #print('\n-----------------------------------')
    #print('SCREEN_NAME:  ' + str(s.user.screen_name))
    fab_user = s.user.screen_name
    fab_felt = ''
    fab_with = ''
    fab_about = s.text
    if hasattr(s,'extended_tweet'):
        fab_about = s.extended_tweet['full_text']
    elif hasattr(s, 'retweeted_status'):
        fab_about = s.retweeted_status.text
        #print('RETWEETED_SCREEN_NAME: ' + s.retweeted_status.user.screen_name)
        if hasattr(s.retweeted_status,'extended_tweet'):  
            fab_about = s.retweeted_status.extended_tweet['full_text']
    if hasattr(s,'quoted_status'):
        quoted_text = s.quoted_status.text  
        #print('QUOTED_SCREEN_NAME: ' + s.quoted_status.user.screen_name)
        if hasattr(s.quoted_status,'extended_tweet'):  
            quoted_text = s.quoted_status.extended_tweet['full_text']    
        #print('QUOTED_TEXT: ' + quoted_text)
    #print('REPLY_TO_SCREEN_NAME: ' + str(s.in_reply_to_screen_name))
    for feeling in a:     # foreach feeling
        #print(feeling)
        if feeling in fab_about:  # is it referenced?
            print(feeling)
            if feeling in totals:
                print("add " + feeling)
                totals[feeling] = 1
            else:
                print("update " + feeling)
                totals[feeling] = totals[feeling] + 1
    #print('FAB_USER: ' + str(s.user.screen_name))
    #print('FAB_FELT: ' + fab_felt)
    #print('FAB_WITH: ' + fab_with)
    #print('FAB_ABOUT: ' + fab_about)
    idx = idx + 1
    #display(s._json)