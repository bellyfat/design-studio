import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BotsBaseComponent } from 'src/app/components/bots/bots-base/bots-base.component';
import { ChangeBotLangModalComponent } from 'src/app/modals/change-bot-lang/change-bot-lang.component';
import { NotifyService } from 'src/app/services/notify.service';
import { Chatbot } from 'src/app/models/faq_kb-model';
import { Project } from 'src/app/models/project-model';
import { DepartmentService } from 'src/app/services/department.service';
import { FaqKbService } from 'src/app/services/faq-kb.service';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
import { AppConfigService } from 'src/app/services/app-config';
import { avatarPlaceholder, getColorBck } from 'src/chat21-core/utils/utils-user';
import { UploadService } from 'src/chat21-core/providers/abstract/upload.service';
import { TiledeskAuthService } from 'src/chat21-core/providers/tiledesk/tiledesk-auth.service';
import { UserModel } from 'src/chat21-core/models/user';
const swal = require('sweetalert');

@Component({
  selector: 'cds-detail-botdetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CDSDetailBotDetailComponent extends BotsBaseComponent implements OnInit {

  @ViewChild('fileInputBotProfileImage', { static: false }) fileInputBotProfileImage: any;
  @ViewChild('editbotbtn', { static: false }) private elementRef: ElementRef;
  
  @Input() selectedChatbot: Chatbot;
  @Input() project: Project;
  @Input() isVisibleDEP: boolean;
  @Input() translationsMap: Map<string, string> = new Map();

  botProfileImageExist: boolean;
  botImageHasBeenUploaded = false;
  // id_faq_kb: string;
  storageBucket: string;
  showSpinnerInUploadImageBtn = false;
  // botProfileImageurl: string;
  // timeStamp: any;


  // faqKb_name: string;
  // faqkb_language: string;
  faqKbUrlToUpdate: string;
  // faqKb_id: string;
  // faqKb_created_at: any;
  // faqKb_description: string;
  faq_lenght: number;
  // botType: string;

  // botTypeForInput: string;
  // webhook_is_enabled: any;
  // webhookUrl: string;
  botDefaultSelectedLang: any
  // language: string;

  all_depts: any;
  depts_without_bot_array = [];
  COUNT_DEPTS_BOT_IS_ASSOCIATED_WITH: number;
  DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY = [];
  DEPTS_HAVE_BOT_BUT_NOT_THIS: boolean
  COUNT_OF_VISIBLE_DEPT: number;
  dept_id: string;
  selected_dept_id: string;
  selected_dept_name: string;
  botHasBeenAssociatedWithDept: string;

  private logger: LoggerService = LoggerInstance.getInstance()
  constructor(
    private uploadService: UploadService,
    // private tiledeskAuthService: TiledeskAuthService,
    // private uploadImageService: UploadImageService,
    // private uploadImageNativeService: UploadImageNativeService,
    private faqKbService: FaqKbService,
    private departmentService: DepartmentService,
    private router: Router,
    private notify: NotifyService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {  super(); }

  ngOnInit(): void {
    this.getDeptsByProjectId();
    // this.checkBotImageUploadIsComplete();
  }

  ngOnChanges() {
    this.logger.log('[CDS-CHATBOT-DTLS] (OnChanges) selectedChatbot ', this.selectedChatbot)
    this.destructureSelectedChatbot(this.selectedChatbot)
  }


  getDeptsByProjectId() {
    this.departmentService.getDeptsByProjectId().subscribe((departments: any) => {
      this.logger.log('[CDS-CHATBOT-DTLS] - DEPT GET DEPTS ', departments);
      this.logger.log('[CDS-CHATBOT-DTLS] - DEPT BOT ID ', this.selectedChatbot._id);

      if (departments) {
        this.all_depts = departments;

        let count = 0;
        let countOfVisibleDepts = 0;

        departments.forEach((dept: any) => {
          this.logger.log('[CDS-CHATBOT-DTLS] - DEPT', dept);

          if (dept.hasBot === true) {
            if (this.selectedChatbot._id === dept.id_bot) {
              this.logger.log('[CDS-CHATBOT-DTLS] - DEPT DEPT WITH CURRENT BOT ', dept);

              count = count + 1;


              // -------------------------------------------------------------------
              // Dept's avatar
              // -------------------------------------------------------------------
              let newInitials = '';
              let newFillColour = '';


              if (dept.name) {
                newInitials = avatarPlaceholder(dept.name);
                if (dept.default !== true) {
                  newFillColour = getColorBck(dept.name);
                } else if (dept.default === true && departments.length === 1) {
                  newFillColour = '#6264A7'
                } else if (dept.default === true && departments.length > 1) {
                  newFillColour = 'rgba(98, 100, 167, 0.6) '
                }
              } else {
                newInitials = 'N/A.';
                newFillColour = '#eeeeee';
              }

              dept['dept_name_initial'] = newInitials;
              dept['dept_name_fillcolour'] = newFillColour;

              // // -------------------------------------------------------------------
              // // Dept's description
              // // -------------------------------------------------------------------
              // if (dept.description) {
              //   let stripHere = 20;
              //   dept['truncated_desc'] = dept.description.substring(0, stripHere) + '...';
              // }
              const index = this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY.findIndex((d) => d._id === dept._id);

              if (index === -1) {
                this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY.push(dept)
              }
              // this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY.indexOf(dept) === -1 ? this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY.push(dept) : this.logger.log("This item already exists");

              // this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY.push(dept)
            }
          } else if (dept.hasBot === false) {
            // this.depts_length = departments.length
            this.logger.log('[CDS-CHATBOT-DTLS] --->  DEPT botType ', this.selectedChatbot.type);

            if (this.selectedChatbot.type !== 'identity') {
              const index = this.depts_without_bot_array.findIndex((d) => d._id === dept._id);

              if (index === -1) {
                this.depts_without_bot_array.push(dept)
              }

              if (dept.default === false && dept.status === 1) {
                countOfVisibleDepts = countOfVisibleDepts + 1;
              }

            }
          }
        });

        this.logger.log('[CDS-CHATBOT-DTLS] ---> Current bot is found in DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY', this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY);

        const hasFoundBotIn = this.DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY.filter((obj: any) => {
          return obj.id_bot === this.selectedChatbot._id;
        });

        if (hasFoundBotIn.length > 0) {
          this.DEPTS_HAVE_BOT_BUT_NOT_THIS = false
          this.logger.log('[CDS-CHATBOT-DTLS] ---> Current bot is found in DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY', this.DEPTS_HAVE_BOT_BUT_NOT_THIS);
        } else {
          this.DEPTS_HAVE_BOT_BUT_NOT_THIS = true
          this.logger.log('[CDS-CHATBOT-DTLS] ---> Current bot is NOT found in DEPTS_BOT_IS_ASSOCIATED_WITH_ARRAY', this.DEPTS_HAVE_BOT_BUT_NOT_THIS);
        }

        this.logger.log('[CDS-CHATBOT-DTLS] - DEPT - DEPTS WITHOUT BOT', this.depts_without_bot_array);

        this.COUNT_DEPTS_BOT_IS_ASSOCIATED_WITH = count;
        this.logger.log('[CDS-CHATBOT-DTLS] - DEPT - COUNT_DEPTS_BOT_IS_ASSOCIATED_WITH', this.COUNT_DEPTS_BOT_IS_ASSOCIATED_WITH);

        this.COUNT_OF_VISIBLE_DEPT = countOfVisibleDepts;
        this.logger.log('[CDS-CHATBOT-DTLS] - DEPT - COUNT_OF_VISIBLE_DEPT', this.COUNT_OF_VISIBLE_DEPT);
      }
    }, error => {

      this.logger.error('[CDS-CHATBOT-DTLS] - DEPT - GET DEPTS  - ERROR', error);
    }, () => {
      this.logger.log('[CDS-CHATBOT-DTLS] - DEPT - GET DEPTS - COMPLETE')

    });
  }

  onSelectDept() {
    this.logger.log('[CDS-CHATBOT-DTLS] --->  onSelectDept dept_id', this.dept_id);
    this.logger.log('[CDS-CHATBOT-DTLS] --->  onSelectDept selected_dept_id', this.selected_dept_id);
    this.logger.log('[CDS-CHATBOT-DTLS] --->  onSelectDept id_faq_kb', this.selectedChatbot._id);
    this.dept_id = this.selected_dept_id


    const hasFound = this.depts_without_bot_array.filter((obj: any) => {
      return obj.id === this.selected_dept_id;
    });
    this.logger.log('[CDS-CHATBOT-DTLS] --->  onSelectBotId dept found', hasFound);

    if (hasFound.length > 0) {
      this.selected_dept_name = hasFound[0]['name']
    }
    // this.hookBotToDept()
  }

  hookBotToDept() {
    this.departmentService.updateExistingDeptWithSelectedBot(this.dept_id, this.selectedChatbot._id).subscribe((res) => {
      this.logger.log('[CDS-CHATBOT-DTLS] - UPDATE EXISTING DEPT WITH SELECED BOT - RES ', res);
    }, (error) => {
      this.logger.error('[CDS-CHATBOT-DTLS] - UPDATE EXISTING DEPT WITH SELECED BOT - ERROR ', error);
    }, () => {
      this.logger.log('[CDS-CHATBOT-DTLS] - UPDATE EXISTING DEPT WITH SELECED BOT * COMPLETE *');
      this.translateAndPresentModalBotAssociatedWithDepartment();
    });
  }

  translateAndPresentModalBotAssociatedWithDepartment() {
    let parametres = { bot_name: this.selectedChatbot.name, dept_name: this.selected_dept_name };

    this.translate.get("BotHasBeenAssociatedWithDepartment", parametres).subscribe((res: string) => {
      this.botHasBeenAssociatedWithDept = res
    });

    swal({
      title: this.translationsMap.get('Done') + "!",
      text: this.botHasBeenAssociatedWithDept,
      icon: "success",
      button: "OK",
      dangerMode: false,
    })
      .then((WillUpdated) => {
        this.getDeptsByProjectId()
        this.depts_without_bot_array = []
      })
  }


  destructureSelectedChatbot(selectedChatbot: Chatbot) {
    this.logger.log('[CDS-CHATBOT-DTLS] - selectedChatbot', this.selectedChatbot)
    if (this.selectedChatbot._id) {
      this.checkImageExists(this.selectedChatbot.url, (existImage)=> {
        existImage? this.botProfileImageExist = true: this.botProfileImageExist= false; 
      })
    }

    this.logger.log('[CDS-CHATBOT-DTLS] - BOT LANGUAGE ', selectedChatbot.language);

    if (selectedChatbot && selectedChatbot.language) {
      this.botDefaultSelectedLang = this.botDefaultLanguages[this.getIndexOfbotDefaultLanguages(selectedChatbot.language)].name
      this.logger.log('[CDS-CHATBOT-DTLS] BOT DEAFAULT SELECTED LANGUAGE ', this.botDefaultSelectedLang);
    }
  }

  // checkBotImageExist() {
  //   if (this.appConfigService.getConfig().uploadEngine === 'firebase') {
  //     this.checkBotImageExistOnFirebase();
  //   } else {
  //     this.checkBotImageExistOnNative();
  //   }
  // }

  // checkBotImageExistOnFirebase() {
  //   this.logger.log('[CDS-CHATBOT-DTLS] checkBotImageExistOnFirebase (FAQ-COMP) ')
  //   this.logger.log('[CDS-CHATBOT-DTLS] STORAGE-BUCKET (FAQ-COMP) firebase_conf ', this.appConfigService.getConfig().firebase)

  //   const firebase_conf = this.appConfigService.getConfig().firebase;
  //   if (firebase_conf) {
  //     this.storageBucket = firebase_conf['storageBucket'];
  //     this.logger.log('[CDS-CHATBOT-DTLS] STORAGE-BUCKET (FAQ-COMP) ', this.storageBucket)
  //   }

  //   const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/' + this.storageBucket + '/o/profiles%2F' + this.selectedChatbot._id + '%2Fphoto.jpg?alt=media';

  //   const self = this;
  //   this.verifyImageURL(imageUrl, function (imageExists) {

  //     if (imageExists === true) {
  //       self.botProfileImageExist = imageExists

  //       self.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) - BOT PROFILE IMAGE EXIST ? ', imageExists, 'usecase firebase')
  //       self.setImageProfileUrl(self.storageBucket);
  //     } else {
  //       self.botProfileImageExist = imageExists

  //       self.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) - BOT PROFILE IMAGE EXIST ? ', imageExists, 'usecase firebase')
  //     }
  //   })
  // }

  // checkBotImageExistOnNative() {
  //   // const baseUrl = this.appConfigService.getConfig().apiUrl;
  //   const baseUrl = this.appConfigService.getConfig().baseImageUrl;
  //   const imageUrl = baseUrl + 'images?path=uploads%2Fusers%2F' + this.selectedChatbot._id + '%2Fimages%2Fthumbnails_200_200-photo.jpg';
  //   const self = this;
  //   this.logger.log('[CDS-CHATBOT-DTLS] HERE YES')
  //   this.botProfileImageExist = false
  //   this.verifyImageURL(imageUrl, function (imageExists) {
  //     // this.logger.log('[CDS-CHATBOT-DTLS] HERE YES 2')
  //     if (imageExists === true) {
  //       self.botProfileImageExist = imageExists

  //       self.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) - BOT PROFILE IMAGE EXIST ? ', imageExists, 'usecase native')
       

  //       self.setImageProfileUrl_Native(baseUrl)

  //     } else {
  //       self.botProfileImageExist = imageExists

  //       self.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) - BOT PROFILE IMAGE EXIST ? ', imageExists, 'usecase native')
       
  //     }
  //   })
  // }

  checkImageExists(image_url, callBack) {
    const img = new Image();
    img.src = image_url;
    img.onload = function () {
      callBack(true);
    };
    img.onerror = function () {
      callBack(false);
    };
  }

 

  // checkBotImageUploadIsComplete() {
  //   this.logger.log('[CDS-CHATBOT-DTLS] checkBotImageUploadIsComplete')

  //   if (this.appConfigService.getConfig().uploadEngine === 'firebase') {

  //     this.uploadImageService.botImageWasUploaded.subscribe((imageuploaded) => {
  //       this.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE - IMAGE UPLOADING IS COMPLETE ? ', imageuploaded, '(usecase Firebase)');
  //       this.botImageHasBeenUploaded = imageuploaded;

  //       if (this.storageBucket && this.botImageHasBeenUploaded === true) {

  //         this.showSpinnerInUploadImageBtn = false;

  //         this.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) - IMAGE UPLOADING IS COMPLETE - BUILD botProfileImageurl ');

  //         this.setImageProfileUrl(this.storageBucket)
  //       }
  //     });
  //   } else {
  //     // Native
  //     this.uploadImageNativeService.botImageWasUploaded_Native.subscribe((imageuploaded) => {
  //       this.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE - IMAGE UPLOADING IS COMPLETE ? ', imageuploaded, '(usecase Native)');

  //       this.botImageHasBeenUploaded = imageuploaded;

  //       this.showSpinnerInUploadImageBtn = false;

  //       // here "setImageProfileUrl" is missing because in the "upload" method there is the subscription to the downoload
  //       // url published by the BehaviourSubject in the service
  //     })
  //   }
  // }

  // setImageProfileUrl(storageBucket) {
  //   this.botProfileImageurl = 'https://firebasestorage.googleapis.com/v0/b/' + storageBucket + '/o/profiles%2F' + this.selectedChatbot._id + '%2Fphoto.jpg?alt=media';

  //   this.timeStamp = (new Date()).getTime();
  // }

  // setImageProfileUrl_Native(storage) {
  //   this.botProfileImageurl = storage + 'images?path=uploads%2Fusers%2F' + this.selectedChatbot._id + '%2Fimages%2Fthumbnails_200_200-photo.jpg' // + '&' + new Date().getTime();;
  //   // this.botProfileImageurl = this.sanitizer.bypassSecurityTrustUrl(_botProfileImageurl)
  //   this.timeStamp = new Date().getTime();
  // }

  // getBotProfileImage(): SafeUrl {
  //   if (this.timeStamp) {
  //     return this.sanitizer.bypassSecurityTrustUrl(this.botProfileImageurl + '&' + this.timeStamp);
  //   }
  //   return this.sanitizer.bypassSecurityTrustUrl(this.botProfileImageurl)
  // }


  // ---------------------------------------------------
  // Upload bot photo
  // ---------------------------------------------------
  upload(event) {
    this.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE  upload')
    this.showSpinnerInUploadImageBtn = true;
    const file = event.target.files[0]

    this.uploadService.upload(this.selectedChatbot._id, file).then((downloadUrl)=> {
      this.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE upload with native service - RES downoloadurl', downloadUrl);

      this.selectedChatbot.url = downloadUrl
      this.showSpinnerInUploadImageBtn = false;

    }, (error) => {

      this.logger.error('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE upload with native service - ERR ', error);
    })
    this.fileInputBotProfileImage.nativeElement.value = '';
  }


  // ---------------------------------------------------
  // Delete bot photo
  // ---------------------------------------------------
  deleteBotProfileImage() {
    // const file = event.target.files[0]
    this.logger.log('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) deleteBotProfileImage')
    this.uploadService.delete(this.selectedChatbot._id, this.selectedChatbot.url).then((result)=>{
      this.botProfileImageExist = false;
      this.botImageHasBeenUploaded = false;

      const delete_bot_image_btn = <HTMLElement>document.querySelector('.delete_bot_image_btn');
      delete_bot_image_btn.blur();
    }).catch((error)=> {
      this.logger.error('[CDS-CHATBOT-DTLS] BOT PROFILE IMAGE (FAQ-COMP) deleteUserProfileImage ERORR:', error)
    })    
  }

  editBot() {
    // RESOLVE THE BUG 'edit button remains focused after clicking'
    this.elementRef.nativeElement.blur();

    // this.logger.log('[CDS-CHATBOT-DTLS] FAQ KB NAME TO UPDATE ', this.faqKb_name);


    this.faqKbService.updateFaqKb(this.selectedChatbot._id, this.selectedChatbot.name, this.faqKbUrlToUpdate, this.selectedChatbot.type, this.selectedChatbot.description, this.selectedChatbot.webhook_enabled, this.selectedChatbot.webhook_url, this.selectedChatbot.language)
      .subscribe((faqKb) => {
        this.logger.log('[CDS-CHATBOT-DTLS] EDIT BOT - FAQ KB UPDATED ', faqKb);
        if (faqKb) {
          this.selectedChatbot.name = faqKb['name']
          this.selectedChatbot.description = faqKb['description']
        }
      }, (error) => {
        this.logger.error('[CDS-CHATBOT-DTLS] EDIT BOT -  ERROR ', error);


        // =========== NOTIFY ERROR ===========
        this.notify.showWidgetStyleUpdateNotification(this.translationsMap.get('UpdateBotError'), 4, 'report_problem');

      }, () => {
        this.logger.log('[CDS-CHATBOT-DTLS] EDIT BOT - * COMPLETE *');
        // =========== NOTIFY SUCCESS===========
        this.notify.showWidgetStyleUpdateNotification(this.translationsMap.get('UpdateBotSuccess'), 2, 'done');
        this.selectedChatbot.name
      });
  }

  // let dialogRef = dialog.open(UserProfileComponent, {
  //   height: '400px',
  //   width: '600px',
  // });

  updateBotLanguage(){
    this.logger.log('open modal to updateeeeee')
    this.logger.log('openDialog')
    const dialogRef = this.dialog.open(ChangeBotLangModalComponent, {
      width: '600px',
      data: {
        chatbot: this.selectedChatbot,
        projectId: this.project._id
      },
    });
    dialogRef.afterClosed().subscribe(langCode => {
      this.logger.log(`Dialog result: ${langCode}`);
      if (langCode !== 'close') {
        this.botDefaultSelectedLang = this.botDefaultLanguages[this.getIndexOfbotDefaultLanguages(langCode)].name
      }
      this.updateChatbotLanguage(langCode)
    })
  }


  updateChatbotLanguage(langCode) {
    this.faqKbService.updateFaqKbLanguage(this.selectedChatbot._id, langCode).subscribe((faqKb) => {
      this.logger.log('[CDS-CHATBOT-DTLS] EDIT BOT LANG - FAQ KB UPDATED ', faqKb);
      if (faqKb) {
       
      }
    }, (error) => {
      this.logger.error('[CDS-CHATBOT-DTLS] EDIT BOT LANG-  ERROR ', error);


      // =========== NOTIFY ERROR ===========
      this.notify.showWidgetStyleUpdateNotification(this.translationsMap.get('UpdateBotError'), 4, 'report_problem');

    }, () => {
      this.logger.log('[CDS-CHATBOT-DTLS] EDIT BOT LANG - * COMPLETE *');
      // =========== NOTIFY SUCCESS===========
      this.notify.showWidgetStyleUpdateNotification(this.translationsMap.get('UpdateBotSuccess'), 2, 'done');
      this.updateChatbot(this.selectedChatbot, langCode)
    });

  }

  updateChatbot(selectedChatbot, langCode) {
    this.logger.log('updateChatbot langCode', langCode) 
    this.selectedChatbot.language = langCode

    this.faqKbService.updateChatbot(selectedChatbot)
      .subscribe((chatbot: any) => {
        this.logger.log('[CDS-CHATBOT-DTLS] - UPDATED CHATBOT - RES ', chatbot);

      }, (error) => {
        this.logger.error('[CDS-CHATBOT-DTLS] - UPDATED CHATBOT - ERROR  ', error);
        // self.notify.showWidgetStyleUpdateNotification(this.create_label_error, 4, 'report_problem');
      }, () => {
        this.logger.log('[CDS-CHATBOT-DTLS] - UPDATED CHATBOT * COMPLETE *');

      });
  }

  goToRoutingAndDepts() {
    this.router.navigate(['project/' + this.project._id + '/departments']);
  }

  goToEditAddPage_EDIT_DEPT(deptid, deptdefaut) {
    this.router.navigate(['project/' + this.project._id + '/department/edit', deptid]);
  }




}