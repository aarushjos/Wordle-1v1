# with open('words_alpha.txt') as file:
#     words=[f'"{line.strip()}"' for line in file if len(line.strip())==5]
#     js="export const validWords=new Set([\n"+",\n".join(words)+"\n]);"
#     with open("validWords.js","w") as out:
#         out.write(js)


with open('google-10000-english-usa.txt') as file:
    words=[f'"{line.strip()}"' for line in file if len(line.strip())==5]
    js="export const guessWords=new Set([\n"+",\n".join(words)+"\n]);"
    with open("guessWords.js","w") as out:
        out.write(js)