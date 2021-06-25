const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, //lưu thông tin cái nút bật
    songs: [
    {
        name: "Nàng thơ",
        singer: "Hoàng Dũng x Freak D",
        path: "./assets/music/song1.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/share/2020/07/31/d/5/a/a/1596188260287.jpg"
    },
    {
        name: "Chỉ là muốn nói",
        singer: "Khải x Freak D",
        path: "./assets/music/song2.mp3",
        image:
        "https://i.ytimg.com/vi/uUB7wnWeMdM/sddefault.jpg"
    },
    {
        name: "Họ yêu ai mất rồi",
        singer: "Doãn Hiếu l (Lofi Ver. By Mr.Paa)",
        path: "./assets/music/song3.mp3",
        image: "data:image/jpeg;base64,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"
    },
    {
        name: "Phố Cũ Còn Anh",
        singer: "Quinn ft Chilly | Soái Nhi (Cover)",
        path: "./assets/music/song4.mp3",
        image:
        "data:image/jpeg;base64,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"
    },
    {
        name: "Anh mệt rồi",
        singer: "Anh Quân Idol x Freak D",
        path: "./assets/music/song5.mp3",
        image:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgVFRUYGRgaGh4cGBwaGhoaGhoaGhoaGhoaHBocIS4lHB4rIRgcJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHhISHjQkIyE0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAACBQEGB//EAD4QAAIBAgQDBQYEBQIGAwAAAAECAAMRBBIhMQVBUSIyYXGBBhNCkaGxUsHR8BQjYnLCsuEkMzRzgqJDU5L/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAhEQEBAAIDAAMBAAMAAAAAAAAAAQIRAyExEjJBUQQiYf/aAAwDAQACEQMRAD8A8xwnhlGnhlxOIX3hqNUCIXZKaU6RValR2RSzHO6qFUc77ajQxHsglRKVemwoLUrU6OQk1FzVHRAyOzBmBV84QrfKrXI2mLwzj/uk9zVpmpTVy6ZXanUpuy5XyuAbowsChFjvL4z2orkr7o+6poysiC1Szq61A7O4Jd86BrnxGxN2A5hPYx/5VT3q5HSi1whOV61WlTyMM2hArKwPxAEaa2vxrgBwyKztmZqjKpHcamoBV165gQd9Nt4twn2lKKqMKha1MEh1CkUHz0Bky6FCBruba3BIleJcWeoq09fdoxZAxJZS1ywzX2JJP2sNIlCEEhQYJIYRaZVoFhDsIJhDGCIi77mOAa6xWr3jGgKCXEqJcTMglwJwCECwVnVEsokAjmE4dWqI7pTd0QEuyqSqgC5u2w01tFEuBLqJFWHRILRkUVY1h8OSZejSmnh6QEllkeRfC4YDeaKLaLoIys58lIZSKce/6at/22+xjdM6RTj3/TVv7G+0OH2gV8wYdj0g3a/75CHcdj0EWA1v8h+c9GIVc1PD9+UmY9BBVamXlrFmqsecOg00A/UfLWEFplrVYc41Qr38+Y6+Im0GjUkisDtJMCSSTomZydktO2mZyS07aS0zA1ufmZciDrgjQ6HmDvvC2mo1XDd8fvlHjE8N3xHImTQRIYCDpiMKsS00DYQbLDMsqRNKwOWJ1h2jNG0Lw3g5ru7s4p0adjVqsLhQdlUfG55KI2NCk+FcNq4h/d0ULtubaBRzZ2Oir4mb2I9n8OmDq1/4hnqU3RFKAe4aoxu9NGYZ6hVLsXGUbWvrBNjGxDJgcChp0ncKFvd6rc6ldx3gACco0AEH7UY5C6Yagf8Ah8MCiH/7HJ/m1mtpdmvbwGm9ozMRIUCUUQgEWs1uAcKFZneoxShSXNWcbhb6IvV2OgH6T0uO4wyYIi3uxiBkoUl7tPDKe05/E7kWLHcax1+DKlKngnOSnTQYniDjmzdykCN20IA8jvv5HiuPbEVWqEZRoqINkRdEQDwEFujQlTSN00nKaQyCStNBqaxtDFUEapyeRobQxhYohjKSVPDNMxT2gP8Aw1b/ALbfaMoZj+2VYjDW/E6j01b/ABhwm8pAy8fPqj3CryA1/SAauB4mVq19dNfP9/u0AWvyHoJ6UiFrjuTOSSRgSSSdmYxhq2oB35H8poTMwqXceGvymnFoVAJLSTtpgckkkmZJJJJmNYm1QBm100YDUeY5+W8WdCND6EbHyjVTDFe0nqvI+XSBRxtbzU7j99RJ43+KZTYGH74jhi60rMrA3F/UHx/WMWhpTGHEbURbDCOKsllTxVlgSsdw2FaoyoilmY2VRqSf3z5Tbo8Kw1Nlp1C2JxDEAUaDZaasdleruT/btYwRmLwjhZruQWCIgz1Xbuog3Y+J2A5n1k409XEFaWGw9b+Gp/8ALVKbuWJ71Ryq9p2+gsJ6jjHtEcMTh8CtKkFsKrooctUG9me+YLtcgnfaeewvEcdjMSlD+LrgOe0VdkCoBmZrIQosoJ+UpiWtD2X4LVpL2lanicUWo0s6lXo0FF8TiCrC4OXsr4kcjMF+FCvialPBIfdqdCzXVEUWao7toqkgm/joOU+g4au+Io4nFe9NPDkmjQdzf3WGSyVKi31Luy7blkAM8Tjcc1ZGw2CpMmFpqXdQRnqKneq13+I7WXYaADQWagd4Fw/CmulBVGJIu9es5daSU01cUkVgWHwh3O5BC2M57G8NTEcRGVbUUd6wUkmyI16aknU6lAb7gGVq/wDC4NKSg/xGMVXqWHaSgT/Lpgb5nOpHp0np/ZHgBTDYvK4XEMvunYkBKAYXZS19XVWzNbY2W9wZhZ3tFxJsbXbD4NS1MuXdh/8AK4AX3jNsKaqFVb6WAPSTCcDwi0a7vUaoaaWzoQtL3pHZSmSL1De120Go01mdjeIKFGDwIPu2YK7bVMS5NgWPJLmwXx1jvGrKUwNNhlpa1H2Vqp1dyeg2+Q3Ak7RjAVYdRJUVQxCEleRIykjqRc2+c6klTLqIdDBKIVYtGDIY2hiaCNUzJ5Hg67zzPt/iLUkS+pYt/wDlcv3eenWeF9uBer3ixyCy8l108zuflH4ZvOf8DPx5CdkZdA3X7iPYXhrVVLUyCy99CQGt+Jb6EfaehtAjJNzA8NOIyqabo5Fw4UlGXkzKBp/cLAzY4d7JlGDOUcA3A1sRcXBBFr2vY30PWC5yGmNpbhfsnmVGqE5iMxTYBTtma9wT0ES9peCe4ysqlVOhF8wHiG39DPoy2PaHx2b0I7I+VohjaSVHCOoZQLkHUa9f/WJ8v1pN3T5tw5e8fKPT0Dey6I5dCzJuU5+jbkeG/jFK/DQ4LUrAjQpc2bxQsd/AmC8mO2uNZEkI9JltmVhfa4Iv5X3lZSJqyTpMl5mckkkmZqB+UBWohtdjyI/PrOq0qTIxelQxDBTvf5xk7xSp/wAxY3Gqd9M4beaSLM7CAlgALkmwA1JPIW5zURSLg6HmDpaRy9NGpw3Emnh6zUtKpZEZh3kokNmKncXcKpPLs9RL4Vf4Wh77avWUrR606Wz1PBm7q+Fzzg8Lg6tPJXdHSmSBmykBgRqo6hhcdDfnC1MNiMdUZ6dHTRRayooHZRAzkLe1hYfLWaC8+VjmGcUMJiKy/wDNrN/DJbdKYUVK7+AKlVvynHw5VmVhYqSrDmCDY/KULVi5TA037Ni7ouao1jcZ2AsiEjubHY5o3HewpDHcfrVKFLDsyrRoqAqqMoJA77a9pt9dtTprN2rTTCYejh6mj4pkqYnquGDdil5kXYj06Q3srlOJzoFpU0Vq2KBprnpe6uHpq7KWVHaxCqQQCy/Dri8Q9oK9arUqO75XZr0y7FAjaBMl7WC2G24vvKlavG+LoK9WtSf3lZ2OWoAypRpjsItIMAS+QC72AW5y69qYtHiFVabUVqOKbtmdQeyx01PyHyErw/h71c5S1qaNUcsbAKtuf4iTYDmY5wjgdXEEZMqgtkVnbKrPvkXQl2trYA2GpsItY57JVaaYlHqMq5FdkLmy+8CHIGPIXN7+AjL0FSqgq52pO6tUqEFDUuQXYXFwozXANiQQdMwslwXDVGLmmilk3qOVFOkATdizdgHoSeRsL2IZ9y6I5LJWRzZyjlgtQhijkkXDXDa2swzC+sS+GW41gPcYipS+FWuh6o3aU356EfIwNWiyMUdSrDdWBBF9dQdtCI7wrPrins60SgHvCTne1qdMf26NbllHWJu7MxdySzElidyTqSZOi4sIsqJYRa0FWHpGLrD04lUhoN9N5834jife1nfkTceWy/QCe74qT7ipbTsN9p88p7X6y/8Aj4+1PkqvuVsRbQm5E7TQIQyjVdRvrbWx6jwl5p8M4M9U37iDdiDr/aOfnOjPKYzdTm99PYCmgPvAoBK6kaEggaG240G/SXfCXQ3GV9bkbkG9rnnppbw05GL5MuSmGzXAWzEAlVF+Q6Lb1jrGwsd9L3NyNLWv+9SZCZTKbjonaqVhY5rAqO0OQHUf06QGFOhYizMST10NgD5Cwlq1INbqNj+R6g8xBowRXdj8TfLMbAep+sa5bgTH41bF4gIt92Oijqf0mG7HYG7G5v56lj84TEViSXb0HQcgIuhOpAuTudh5DqBI5XYZXZu6soSoMyC2nMW2II1mJxfhppEMpzIx7J6c8p8fvNQM3NfkR+cZSoroabi6Noeo6EdCDrNjncb14WzbxpMgMY4lg2ouUbzU8mXkYoDO2WWbiWhbzlpFlsh6H5QgcUyrNOkwRMiuA/fWOGJv31jhjVO+vV+wGHHv2rspZMOhew1LO11poANSb3YW/BNaoRhmZ6gV8W5LlTZkoFjmuw2aprtsvjFOB+0VLDYL3dC5xNRyzsVOWmNlKk6M2UC3Qsx8Dn4djmzX7V81zqb3vc331kc7o2Mey4pQyUKYxbMQT72oub+ZWqkWWmv4UVTZmOg0tqdFOEcQZ2fEvlWnhU/lU10pq75lQKvM967HW9pg4/F1Kzl6rFmIAubbDkANAPCatPBMaNKiOznviKzHupTF0Qt4ABiBuSw6wS7vTaZ3DMD71nd2yovbqvuRc7KPidjew8+kvxN8jK9dfdYZCHw+EHfr1Abq9Rd7XALO3IZV3mxxriPuEoUsKWRGpiqzaZ2Lk5SxtcNYctr2G08hxMNQf3rknENZkDdpqex94979v8KnX4jay5mw6umrS4k7UMCzVLjE4+szVb6EU6bEstt17bWI8T0nlBTbLmynKSQGsbEixIB6i4+YnrvaDh3vK9OmXKUMLhaK1XOoQFc5I/FUYuABuTboTMkE4vEUcPTXJTzCnSQG/u0JuzE/E51dm5nwAlKVsYXBilgVDkr/ABB97WI73uEJFGmv9Tvdh4A9Ipwbip9+XOjLSdMKigkLUcZKaKBtfOSWO51O8N7ccUSriDSpaUqNkS2xZQFJH9ItYeRPxQPsVlGNps1jlDMgOzOFbIuvMnbxtBfWaftcKFBUwVHMTTymo2c5C+XW6DQub3udtAOcW4Zhm/g6tlLNXqU6dJQLsxp5ncgc7XAv4xrBYBn/AJ/EKQRL3eq5enUc/hWmts7eOXzJtH+CceapiKdOmopYemHZUQdtlRS4UvqzMzKCVB11veLfRI8dX3a0sEuppgNVtrmruASNN8oIUeczy2QFFIudHIP/AKjwvueZ8BqbGuUZy7K1eoS1QqbinmJJQHYvrYkaAdnrElksr2K4EssqJ1YgwUQ9OAEKlXWwBY9FF/nyHqRBZvw8U4qf5FT+w/aeF4fhXqHIgudzrYAdSZ7+vhWdGVrIrCx1u1jvoNAfUwOF4ZQpLZAc34ybm/Xp8pbjtxxv9DLHbPwHAEp2dznYa9FFug5+vyhsRxI27IsPmZXFV3DHW2liOXj+vrEyJDVt3l23jco0iidXBV3O5ZhZhTB6BTb184fPfUag63632mZhOKZVyuGJBNiBe4JJF9dDv8oTAYsMWW2XXMoJ1yncehPyYTp6102N70emHUqlyb7Bmyjr2j2vlNjEPlRm5gG3ny+s89hluAnUfQd63oLjzETK9GyWUB9Tt8I/y/SFklDVHLXy1+uw9ZP0i8GNG8x9Rb8j9IQSlXkejD69n87+kEZbiFAV0CGwqA/y2PO+6nwsPpPIuhUlWBBBsQdwRynrENzfpoPPmfy+cU49hM6e+UdtB2/6k5P5jn4eUtw56vxvhcpvtgI567zt4NTL3nWkcJlHMsZRpKLAv31jhMSqd9POOw0l9N4bebmHEwsLuJvUJz8h8RSsPX4hVdFps5yKAAtgNFvlBIF2tc2ve14EyknKLTy4hKC1wwyBjTRrKXXduyxGZVvm2I1v1nkOJEl2vqTqSdSb8z1m9VxLlFQsciksq8gWtc/QfXqZg4/vn0lcb2XITG8Xr1UVKlQsiWsLAahQoLEAF2CgC7XNoqjFSCpII2IJBHkRtBy4lCtHD8JqOiumUg3+IAi17g3trYX05Qj8Iqq6owVS50uy6AC5JtewA1lMJiqShcyMWUaFTl7WZjfMCDzXTllPW4YfE4Y2JRyxF27R7xJvu2vW/j6nMs/Daxylzcm4GZi7LZS1rC5+FtBzEK3B6qqzMo7N79obC+o67QNDFYcVAwpMUA7pYk5swN7310uLQ38VRIS1NrqQWF9GG5W99r6XIJAsOVymUEarwt0Us2XKOhv8QX87+UAsJiK1IrZEZTe9yxOnQ6wSxKIonVlBLqrMQq94/IDmx8PvpF0MEQFjkXfcnko6n8hzhXxaUxlDAc9dWPiQJXFVUo0yAfU7u50F/X96TA13JuTuepl+Pj22WXxbTcSpnd/mG/SHpV1fusG8j9556XDcrkeKmzDxBG0reH+Us5r+xq8RRbZswVhtcgA+BvMtXBFxrMHFUmV7MbncNrcjkQTr/uI9hK2Vc7ldRdAT3iHC3K3HRvl5SWXEb5Sn8va3FxfNY3FwWA8rAHlzmjwhRmc8wqgf+RJP+gTOFQWzX03J285q8EINNnGzPYHqEFvuWk53TY+i8UP8tvS/lmF4jUolADn1ZdgAAAbaXNydvCaWLQNZDzIY/wBqEMfmbD1mbiKxdrn08omd70ORb3S9L+ev3hJJIpUlKqZlK9QR9JeQTMpSa6qRpcD7bQyPY6i42I6g6EQFAaEdCfuT+cJCzyOIp5HZPwsQPIHT6Ssc40lqpP4gD/j+USvO3G7xlRvVPGVaWMq0CoFXvp5x0xKt31847NSX01hdxN+hMDC7z0FDac/J6fFcyssZUxIIbTHx57Z9JruZj489symHpci5lllTIDKlEWXg1MuDFYWmYdWiyGGDRaMMqYZDFUaHQxKI7OB+/kB4zRw9PIuvfbVvDoo8B97nnFuH0gT7xu6psg6tsW9Nh6+EHxXF2GUHtP8AReZ/If7R8MTzqbrPx9bO/wDSug8Tzb6aeXjFrnMBfkfy/WWAlKptY9D9Of6+k65jqac2WXyu0Zu0B4H7iXi7pchvNR4XsQbeaiED9oAixsdN7m67dYQ0tWw6uAp3BGU9LkAgnob/ADAmVjauZyAFVVLKgUG2XOza3Op7U1Sp1BGvZJvpbUsBbrYqfWA4jQzjOO8o7X9Sj4vMfbyi2b7NLrpknQeA1n0HAYfJSpod1QX/ALj2m+pM8Rw2hnq00/E4v5A3b6Az3tZyTZe8Tp4DmT4D97yOf8W4/wCs7E1x2xftE5SPwqNh63J9fCIzYxGFVlyjS2gbnvck9bnUzJqIyHKwseXQ+RnNljrs9jkkkkUrjNYXPKCV2O2/0Xz6nwlat2IABIU3Nja53A9N/lCK9tMhA8gfsYdMsi20lpVXB2+xH3loGYntCmqN4MPsR+cyJt+0XcT+/wDxb9Jhzs4/pEsvT8q07ecaFQCr3l849EaveXzjxmpP0zhe8Jv0DpPP4Y6ibtEyHJ6bEYmVJnLypMQVHMycb35qOZlY7v8ApHw9CgmVvITOXlSipLiBUwgMFjCKYUGABhVMWjBkMaw1Muco/wDJvwj9TyH6RFSdhqToB1J0A+ZE9MtAIoQctWP4m5kxdGxm1a1VUW+yKNAOQ2A85gVHLMWbc/Qch6frGeJYnO2Ud1Tr4t/t9/KJK+/h+l508eOptPly31EdrD7ec4qddT+9pE1N/l5S8qkXqMArAnui4/x9bi0M2gzm/ZIycgS2dWN+drD69IalQVlcta5ColyL3ZrMVB3IBGvn4xRgCFa22W2tzqxY62H4zE+Xytk/D61NiJpceUIrWNxBIoDEeA/OEjEG4JhAmJzAdj3bungdFK+mY+hm7hmuM/Nv9Pwj8z4nwmTwqraoqnmrgedg3+M2pz8nWTq4vq7KugYWIBHQ6iWiuOxWQWHfO3h/UfD7yapDH00DZUuCNWIYkDwsbi/5ecW92fxN8l/SWA9eZJ3J5kzsjbupuIoAsJackgB2SckmZj+0h7Cf3/4tMSbHtI2iDxY/ID9ZjTs4vpEsvT95JUmSE+wqveHnHYhU3HnHpqUfD7ib1Azz9E6zboNoJHkNDMozTmaDZpMXGaZmPPa9I+zzPxh7XpKYTsL4AZW8l5wyhV1MIDAKYaasuDLqYMGHw1Eu6ot9TqRrZbi7el4oxrcBwuZveN3V0TxfmR5D636TUdrkmDwyBUUDTKoU+B+ID5CJ4XiQd8qg2AY3NtbFbW8O1BpWahLiCZajdCA3zuD/AKb+sTUXJHK+vyGkLxR71HHiq+QsD92lFW1504/WObP7VeXw9LPqTZRudrn8Kn8/2BohY2G3xHp4Dx+0a1NgFsMvZtawD7G9+Vjy6xOTP8g4Y/tUrITTdgAAqaW0tamSLWN93B9PGZuCxGdLHRhv49CJuYxQKLgC3Yb7TyODqZSG8dfI7/vwi8OW9myjbZe16SUjp++s7zB5W+9jAvdUPPQ+hP5Xl0jOCNmWoeTDL4LexPqL+lp6UsALnQTARLAKNgLfKVdlAAY6cgTcDyBnDc922urH/WaaOJ4oqg5O0euyX8+fpESxJuSSTuT+9BAVaikaHUaryN9hofOXWoRo1vMbH9D4Rcra1uxJ2DJI8R9R+ssjg7H9R5jlF0C05JJMzs5OBhe3OdmZge0zdqmPBvusyY7x+tmrZb6KoHqdT+USAnbxzWESy9PXnLzktaAwNTcR4xCtuI+ZqUSnvNiidJjJvNekRaSzPBS0qWgXxKD4h9/tF3xy8gT+/GLMaJhjEsVvO/xRPIDziuJdr6nlKYzsKtOWi2c9Z3MesfRTAhhAYbD1HNkBPj8I8ztD4zB1adixBB5jUX6HTSCjqrCafAx/N6Ao635AmxAv10PyguG8IdrPVJVdwo0dvP8ACPr5TcFNQuQKAo2Xl5nqfGJabHG+gV2zpUVRYkE28W7w87gj5RTh9Eo5ZgAqpuLWIYg3BHLsmFxCKjXQlX6C1vJgTYD5Razk1LFArrYAvfI1rHlbLcmGW60ayb3/AAuz5iWO7G5/T5WHpKgE6D1PIfqZd8LVI7IUnnlYH5A2gcjrZSSpsTroAACSb8wAJXLPU1EJjd7pliBZQNtdeehO3xa2+kZw625kmwHpqeWg1Y/OIqbnTQAC2lrnIt7nc63hc5HP778rTnyn5FIdxp/lVP7D9p42ltPWGmcpDuQGFio6dCd/laKHDUBotO/q36y3Hx3GdkyylI8OrXGQ7ju+XMen28o6RfQziYekCCEsRtZ3/WFCp/WP/K/3lptOklQX1zKOWUG5t1I2jlJk+Ei5694/PWcamltLt/cSCPIraLvh78yR0a5Hzvf7yOXD8u9nxz0edAdxeVNLoTboe0Prr9YugZO7cjmpN/kTt9ozTqBhcbGc+eGWPquOUycCW7psOh1H6j5zrIDuB58/9peSJsQxS6Mw9Qf9QMnu+rMfUD/SBCQL1wHCfEQT5Acz0m7rCIoAsBaDxVcIjO2wHz6D5w0817R4zMwpqdF1b+7kPQfeNhj8stBbqMl6hZizbk3PmYZDpFVjSbTtSp0SwkkkzlsRuIyMSSAQBOyQ/hU963X5afaWQEnU3kkgpsTPuxOHKNzJJFMJTVj3VPrp94DEob622kkgno2dG8JwZ2GZ2CL494+h29ZpU8Jhk+HOera/fT6SSQ0I7XxbMLDsjoIuRJJMzRwWMLHI57XI/iH6/vyYxNXIhboNPE7D62kkiX088Y2vM3PM+MkkkciXtrGMNRDkZy2zEi7DUjKdL6XViNuvSSSa+NDFanh00KEnkodyT6X0HidIlh1UuXK5VUdlcxa3jc8/t85JI/HjE+TKq1HLG5nJJJdJySSSBkkkkmZJRXyNf4T3vA8j+vpJJE5JLLs2PpySSSee6AcRXCC+55D98oDA0zcuxBJ0v/q+oA8lkklZ9C/pqoxA032HnPF8QTLVdejHffXX85ySNwe1qXUwvvDJJOkj/9k="
    }
    ],
    setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
    const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
    });
    playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
        get: function() {
        return this.songs[this.currentIndex];
        }
    })
    },

    handleEvents: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý hình ảnh CD quay
    const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)' }
    ], {
        duration: 10000, // 10s
        iterations: Infinity
    });

    cdThumbAnimate.pause();

    // console.log(cdThumbAnimate)

    // Xử lý phóng to / thu nhỏ CD (thanh scroll)
    document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    }

        // xử lý khi click play
        playBtn.onclick = function() {
        if(_this.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        }
        
        // Khi bài hát được play
        audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
        }
        // Khi bài hát bị dừng
        audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThumbAnimate.pause();
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
        if(audio.duration) {
            // audio.duration: Tong số giây bài hát
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent
        }
        }

        // Xư lý khi tour bài hát
        progress.onchange = function(e) {
        // e.target.value: số lượng khi kéo từ 1 đến 100
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
        if(_this.isRandom) {
            _this.playRandomSong()
        } else {
            _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
        }

        // Khi Prev bài hát
        prevBtn.onclick = function() {
        if(_this.isRandom) {
            _this.playRandomSong()
        } else {
            _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random bài hát
        randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom;
        _this.setConfig('isRandom', _this.isRandom);
        randomBtn.classList.toggle('active', _this.isRandom);
        _this.playRandomSong()
        }

        // Xử lý phát lại 1 bài hát
        repeatBtn.onclick = function(e) {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig('isRepeat', _this.isRepeat);
        repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý next bai hat khi audio ended
        audio.onended = function() {
        if(_this.isRepeat) {
            audio.play()
        } else {
            nextBtn.click()
        }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)')
        if (songNode || e.target.closest('.option')) {
            // Xử lý khi click vào bài hát
            if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index) // dataset.index = songNode.getAttribute('data-index')
            _this.loadCurrentSong()
            audio.play()
            _this.render()
            }
            // Xử lý vào option
            if (e.target.closest('.option')) {
            
            }
        }
        }
    },

    // Kéo xuống dưới không bị chuyển màn hình
    scrollToActiveSong:function() {
    setTimeout(() => {
        $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        })
    }, 300)
    },

    loadCurrentSong: function() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    },

    loadConfig: function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
    },

    nextSong:function() {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
    }
    this.loadCurrentSong()
    },

    prevSong:function() {
    this.currentIndex--;
    if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
    },

    playRandomSong: function() {
    let newIndex
    do {
        newIndex = Math.floor(Math.random() * this.songs.length)
    } while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
    },

    start: function() {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig()

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe và xử lý các sự kiện (Dom event)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render lại cái danh sách bài hát
    this.render()

    // Hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle('active', this.isRandom);
    randomBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();